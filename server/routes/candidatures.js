const express = require("express");
const router = express.Router();
const db = require("../db");

// Récupérer toutes les candidatures
router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM candidatures ORDER BY id DESC",
        [],
        (err, rows) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(rows);

        }
    );

});

// Ajouter une candidature
router.post("/", (req, res) => {

    const {
        nom,
        age,
        discord,
        tempsJeu,
        disponibilite,
        q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,
        statut,
        date
    } = req.body;

    db.run(

        `INSERT INTO candidatures
        (
            nom,
            age,
            discord,
            tempsJeu,
            disponibilite,
            q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,
            statut,
            date
        )

        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,

        [
            nom,
            age,
            discord,
            tempsJeu,
            disponibilite,
            q1,q2,q3,q4,q5,q6,q7,q8,q9,q10,
            statut,
            date
        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                success:true,

                id:this.lastID

            });

        }

    );

});
// =====================================
// MODIFIER LE STATUT D'UNE CANDIDATURE
// =====================================

router.put("/:id", (req, res) => {

    const { statut } = req.body;

    db.run(
        "UPDATE candidatures SET statut = ? WHERE id = ?",
        [statut, req.params.id],
        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                success: true
            });

        }

    );

});
// =====================================
// SUPPRIMER UNE CANDIDATURE
// =====================================

router.delete("/:id", (req, res) => {

    db.run(
        "DELETE FROM candidatures WHERE id = ?",
        [req.params.id],
        function(err){

            if(err){
                return res.status(500).json(err);
            }

            res.json({
                success: true
            });

        }

    );

});
module.exports = router;