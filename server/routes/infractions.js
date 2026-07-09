const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// ==============================
// CHARGER LES INFRACTIONS
// ==============================

function chargerInfractions() {

    const fichier = path.join(
        __dirname,
        "..",
        "data",
        "infractions.json"
    );

    console.log("Lecture du fichier :", fichier);

    const contenu = fs.readFileSync(fichier, "utf8");

    console.log(contenu);

    return JSON.parse(contenu);

}

// ==============================
// TOUTES LES INFRACTIONS
// ==============================

router.get("/", (req, res) => {

    res.json(chargerInfractions());

});

// ==============================
// RECHERCHE
// ==============================

router.get("/recherche/:nom", (req, res) => {

    const texte = req.params.nom.toLowerCase();

    const resultat = chargerInfractions().filter(i =>
        i.nom.toLowerCase().includes(texte)
    );

    res.json(resultat);

});
console.log("✅ Route infractions chargée");
module.exports = router;

