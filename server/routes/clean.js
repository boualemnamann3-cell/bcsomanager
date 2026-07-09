const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", (req, res) => {

    db.run(`
        DELETE FROM agents
        WHERE id NOT IN (
            SELECT MIN(id)
            FROM agents
            GROUP BY matricule
        )
    `, function(err){

        if(err){
            return res.status(500).json(err);
        }

        res.json({
            success: true,
            message: "Doublons supprimés",
            lignesSupprimees: this.changes
        });

    });

});

module.exports = router;