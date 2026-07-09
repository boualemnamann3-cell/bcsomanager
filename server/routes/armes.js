const express = require("express");
const router = express.Router();

const db = require("../db");


// ==============================
// GET TOUTES LES ARMES
// ==============================

router.get("/", (req, res) => {

    db.all(
        "SELECT * FROM armes",
        [],
        (err, armes) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json(armes);

        }
    );

});



// ==============================
// AJOUTER UNE ARME
// ==============================

router.post("/", (req, res) => {


    const {
        nom,
        type,
        calibre,
        quantite
    } = req.body;



    db.run(

        `
        INSERT INTO armes
        (nom, type, calibre, quantite)

        VALUES (?, ?, ?, ?)
        `,

        [
            nom,
            type,
            calibre,
            quantite
        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }


            res.json({

                id:this.lastID,
                message:"Arme ajoutée"

            });


        }

    );


});



// ==============================
// SUPPRIMER UNE ARME
// ==============================

router.delete("/:id", (req,res)=>{


    db.run(

        "DELETE FROM armes WHERE id = ?",

        [req.params.id],

        err=>{


            if(err){

                return res.status(500).json(err);

            }


            res.json({

                message:"Arme supprimée"

            });


        }

    );


});


module.exports = router;