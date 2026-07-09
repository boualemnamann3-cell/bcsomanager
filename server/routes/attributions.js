const express = require("express");
const router = express.Router();

const db = require("../db");

// ==============================
// ATTRIBUER UNE ARME
// ==============================

router.post("/", (req, res) => {

    const {

        agent_id,

        arme_id,

        quantite

    } = req.body;

    if (!agent_id || !arme_id) {

        return res.status(400).json({

            message: "Informations manquantes."

        });

    }

    db.get(

        "SELECT quantite FROM armes WHERE id = ?",

        [arme_id],

        (err, arme) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (!arme) {

                return res.status(404).json({

                    message: "Arme introuvable."

                });

            }

            if (arme.quantite < quantite) {

                return res.status(400).json({

                    message: "Stock insuffisant."

                });

            }

            db.run(

                `INSERT INTO attributions_armes
                (agent_id, arme_id, quantite, date_attribution)

                VALUES (?, ?, ?, datetime('now'))`,

                [

                    agent_id,

                    arme_id,

                    quantite

                ],

                function(err){

                    if(err){

                        return res.status(500).json(err);

                    }

                    db.run(

                        `UPDATE armes

                        SET quantite = quantite - ?

                        WHERE id = ?`,

                        [

                            quantite,

                            arme_id

                        ],

                        err2 => {

                            if(err2){

                                return res.status(500).json(err2);

                            }

                            res.json({

                                message:"Arme attribuée."

                            });

                        }

                    );

                }

            );

        }

    );

});
// ==============================
// ARMES D'UN AGENT
// ==============================

router.get("/:agentId", (req, res) => {

    const { agentId } = req.params;

    db.all(

        `SELECT

            aa.id AS attribution_id,

            a.id,

            a.nom,

            a.type,

            a.calibre,

            aa.quantite,

            aa.date_attribution,

            aa.statut

        FROM attributions_armes aa

        INNER JOIN armes a
            ON a.id = aa.arme_id

        WHERE aa.agent_id = ?
        AND aa.statut = 'Attribuée'`,

        [agentId],

        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }

    );

});
// ==============================
// RESTITUER UNE ARME
// ==============================

router.delete("/:id", (req, res) => {

    const id = req.params.id;

    db.get(

        `SELECT *

         FROM attributions_armes

         WHERE id = ?`,

        [id],

        (err, attribution) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (!attribution) {

                return res.status(404).json({

                    message: "Attribution introuvable."

                });

            }

            db.run(

                `UPDATE attributions_armes

                 SET

                    statut = 'Restituée',

                    date_retour = datetime('now')

                 WHERE id = ?`,

                [id],

                err => {

                    if (err) {

                        return res.status(500).json(err);

                    }

                    db.run(

                        `UPDATE armes

                         SET quantite = quantite + ?

                         WHERE id = ?`,

                        [

                            attribution.quantite,

                            attribution.arme_id

                        ],

                        err2 => {

                            if (err2) {

                                return res.status(500).json(err2);

                            }

                            res.json({

                                message: "Arme restituée."

                            });

                        }

                    );

                }

            );

        }

    );

});
// ==============================
// SUPPRIMER UNE ATTRIBUTION
// ==============================

router.delete("/supprimer/:id", (req, res) => {

    db.run(

        "DELETE FROM attributions_armes WHERE id = ?",

        [req.params.id],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                message:"Attribution supprimée."

            });

        }

    );

});
module.exports = router;