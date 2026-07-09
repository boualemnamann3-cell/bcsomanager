const express = require("express");
const router = express.Router();
const db = require("../db");

// =====================================
// LISTE DES RAPPORTS
// =====================================

router.get("/", (req, res) => {

    db.all(
        `
        SELECT *
        FROM rapports_complets
        ORDER BY id DESC
        `,
        [],
        (err, rows) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    message: "Erreur lors du chargement des rapports."
                });

            }

            res.json(rows);

        }
    );

});

// =====================================
// RÉCUPÉRER UN RAPPORT
// =====================================

router.get("/:id", (req, res) => {

    db.get(
        `
        SELECT *
        FROM rapports_complets
        WHERE id = ?
        `,
        [req.params.id],
        (err, row) => {

            if (err) {

                console.error(err);

                return res.status(500).json(err);

            }

            if (!row) {

                return res.status(404).json({
                    message: "Rapport introuvable."
                });

            }

            res.json(row);

        }
    );

});

// =====================================
// CRÉER UN RAPPORT
// =====================================

router.post("/", (req, res) => {

    const r = req.body;
    const annee = new Date().getFullYear();
db.get(

`SELECT COUNT(*) AS total
FROM rapports_complets
WHERE numero LIKE ?`,

[`BCSO-${annee}-%`],

(err,row)=>{

    if(err){

        return res.status(500).json(err);

    }

    const compteur =
        String((row.total || 0)+1)
        .padStart(4,"0");

    const numero =
        `BCSO-${annee}-${compteur}`;

    db.run(

`INSERT INTO rapports_complets(

numero,
date,
heure,
agent,
matricule,
grade,
unite,
suspect_nom,
suspect_prenom,
telephone,
heure_menottage,
miranda,
heure_miranda,
droits_demandes,
lieu,
fouille,
objets_trouves,
agents_presents,
description,
infractions,
amende,
prison,
defcon,
statut,
validation,
commentaire,
texte_final,
created_at

)

VALUES(
?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
)`,

[

numero,

r.date,
r.heure,

r.agent,
r.matricule,
r.grade,
r.unite,

r.suspect_nom,
r.suspect_prenom,
r.telephone,

r.heure_menottage,

r.miranda,
r.heure_miranda,

r.droits_demandes,

r.lieu,

r.fouille,
r.objets_trouves,

r.agents_presents,

r.description,

r.infractions,

r.amende||0,

r.prison||0,

r.defcon,

"Brouillon",

"",

"",

r.texte_final||"",

new Date().toISOString()

],

function(err){

    if(err){

        return res.status(500).json(err);

    }

   res.json({

    id:this.lastID,

    numero,

    message:"Rapport créé."

});

});

});

});

// =====================================
// MODIFIER UN RAPPORT
// =====================================

router.put("/:id", (req, res) => {

    const r = req.body;

    db.run(
        `
        UPDATE rapports_complets SET

            numero = ?,
            date = ?,
            heure = ?,

            agent = ?,
            matricule = ?,
            grade = ?,
            unite = ?,

            suspect_nom = ?,
            suspect_prenom = ?,
            telephone = ?,

            heure_menottage = ?,

            miranda = ?,
            heure_miranda = ?,

            droits_demandes = ?,

            lieu = ?,

            fouille = ?,
            objets_trouves = ?,

            agents_presents = ?,

            description = ?,

            infractions = ?,

            amende = ?,
            prison = ?,

            defcon = ?,

            statut = ?,

            validation = ?,

            commentaire = ?,

            texte_final = ?

        WHERE id = ?
        `,
        [

            r.numero,
            r.date,
            r.heure,

            r.agent,
            r.matricule,
            r.grade,
            r.unite,

            r.suspect_nom,
            r.suspect_prenom,
            r.telephone,

            r.heure_menottage,

            r.miranda,
            r.heure_miranda,

            r.droits_demandes,

            r.lieu,

            r.fouille,
            r.objets_trouves,

            r.agents_presents,

            r.description,

            r.infractions,

            r.amende,

            r.prison,

            r.defcon,

            r.statut,

            r.validation,

            r.commentaire,

            r.texte_final,

            req.params.id

        ],

        function(err){

            if(err){

                console.error(err);

                return res.status(500).json(err);

            }

            res.json({

                message:"Rapport modifié."

            });

        }

    );

});

// =====================================
// SUPPRIMER
// =====================================

router.delete("/:id",(req,res)=>{

    db.run(

        "DELETE FROM rapports_complets WHERE id=?",

        [req.params.id],

        function(err){

            if(err){

                console.error(err);

                return res.status(500).json(err);

            }

            res.json({

                message:"Rapport supprimé."

            });

        }

    );

});
// =====================================
// ENVOYER EN VALIDATION
// =====================================

router.put("/:id/envoyer", (req, res) => {

    db.run(
        `
        UPDATE rapports_complets
        SET
            statut = 'En attente'
        WHERE id = ?
        `,
        [req.params.id],
        function(err) {

            if (err) {

                console.error(err);

                return res.status(500).json(err);

            }

            res.json({

                message: "Rapport envoyé à l'État-Major."

            });

        }

    );

});

// =====================================
// VALIDER
// =====================================

router.put("/:id/valider", (req, res) => {

    db.run(
        `
        UPDATE rapports_complets
        SET

            archive = 1,

            statut = 'Archivé',

            validation = 'Validé',

            valide_par = ?,

            commentaire = ?,

            date_validation = ?,

            date_archivage = ?

        WHERE id = ?
        `,
        [

            req.body.validateur || "État-Major",

            req.body.commentaire || "",

            new Date().toISOString(),

            new Date().toISOString(),

            req.params.id

        ],

        function(err){

            if(err){

                console.error(err);

                return res.status(500).json(err);

            }

            res.json({

                message:"Rapport validé et archivé."

            });

        }

    );

});
// =====================================
// ARCHIVER
// =====================================

router.put("/:id/archiver", (req, res) => {

    db.run(
        `
        UPDATE rapports_complets
        SET

            archive = 1,

            statut = 'Archivé',

            date_archivage = ?

        WHERE id = ?
        `,
        [

            new Date().toISOString(),

            req.params.id

        ],

        function(err) {

            if (err) {

                console.error(err);

                return res.status(500).json(err);

            }

            res.json({

                message: "Rapport archivé."

            });

        }

    );

});

// =====================================
// EXPORT
// =====================================

module.exports = router;

