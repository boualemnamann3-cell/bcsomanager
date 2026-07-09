const express = require("express");
const router = express.Router();
const db = require("../db");

// ==========================
// LISTER LES UNITÉS
// ==========================

router.get("/", (req, res) => {

    db.all(

        "SELECT * FROM unites ORDER BY nom ASC",

        [],

        (err, rows) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(rows);

        }

    );

});

// ==========================
// AJOUTER UNE UNITÉ
// ==========================

router.post("/", (req, res) => {

    const {

        nom,
        description,
        chef,
        logo,
        couleur

    } = req.body;

    db.run(

        `

        INSERT INTO unites

        (

            nom,
            description,
            chef,
            logo,
            couleur

        )

        VALUES (?,?,?,?,?)

        `,

        [

            nom,
            description,
            chef,
            logo,
            couleur

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
// ==========================
// SUPPRIMER UNE UNITÉ
// ==========================

router.delete("/:id", (req, res) => {

    db.run(

        "DELETE FROM unites WHERE id = ?",

        [req.params.id],

        function(err){

            if(err){

                console.error(err);

                return res.status(500).json({

                    success:false,

                    message:"Impossible de supprimer l'unité."

                });

            }

            if(this.changes === 0){

                return res.status(404).json({

                    success:false,

                    message:"Unité introuvable."

                });

            }

            res.json({

                success:true,

                message:"Unité supprimée."

            });

        }

    );

});
module.exports = router;

