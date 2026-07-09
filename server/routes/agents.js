const express = require("express");
const router = express.Router();
const db = require("../db");

// ==========================
// LISTER LES AGENTS
// ==========================

router.get("/", (req, res) => {

    db.all(
        `
        SELECT *
        FROM agents
        WHERE archive = 0
        ORDER BY
        CASE grade
            WHEN 'Sheriff' THEN 1
            WHEN 'Sheriff Adjoint' THEN 2
            WHEN 'Commandant' THEN 3
            WHEN 'Capitaine' THEN 4
            WHEN 'Lieutenant' THEN 5
            WHEN 'Sergeant I' THEN 6
            WHEN 'Deputy II' THEN 7
            WHEN 'Deputy I' THEN 8
            WHEN 'Rookie' THEN 9
            ELSE 99
        END,
        CAST(matricule AS INTEGER) ASC
        `,
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
// AJOUTER UN AGENT
// ==========================

router.post("/", (req, res) => {

    const {

        matricule,
        nom,
        prenom,
        identifiant,
        code,
        grade,
        telephone,
        statut,

        badge,
        dateEntree,
        superieur,
        datePromotion,
        notes,

        etat_major,
        mary_hp,
        k9,
        cid,
        amd,
        sheriff_academy

    } = req.body;

    db.get(

        "SELECT id FROM agents WHERE matricule = ?",

        [matricule],

        (err, row) => {

            if (err) {

                return res.status(500).json(err);

            }

            if (row) {

                return res.status(400).json({

                    success: false,

                    message: "Ce matricule existe déjà."

                });

            }

            db.run(

                `
                INSERT INTO agents (

                    matricule,
                    nom,
                    prenom,
                    identifiant,
                    code,
                    grade,
                    telephone,
                    statut,

                    badge,
                    dateEntree,
                    superieur,
                    datePromotion,
                    notes,

                    etat_major,
                    mary_hp,
                    k9,
                    cid,
                    amd,
                    sheriff_academy

                )

                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                `,

                [

                    matricule,
                    nom,
                    prenom,
                    identifiant,
                    code,
                    grade,
                    telephone,
                    statut,

                    badge,
                    dateEntree,
                    superieur,
                    datePromotion,
                    notes,

                    etat_major || 0,
                    mary_hp || 0,
                    k9 || 0,
                    cid || 0,
                    amd || 0,
                    sheriff_academy || 0

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

        }

    );

});
// ==========================
// SUPPRIMER UN AGENT
// ==========================

router.delete("/:id", (req, res) => {

    db.run(
        "DELETE FROM agents WHERE id = ?",
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                changes: this.changes
            });

        }
    );

});
// ==========================
// MODIFIER UN AGENT
// ==========================

router.put("/:id", (req, res) => {

        const {

        matricule,
        nom,
        prenom,
        identifiant,
        code,
        grade,
        telephone,
        statut,

        badge,
        dateEntree,
        superieur,
        datePromotion,
        notes,

        etat_major,
        mary_hp,
        k9,
        cid,
        amd,
        sheriff_academy

    } = req.body;

    db.run(

        `
        UPDATE agents

        SET

            matricule = ?,
            nom = ?,
            prenom = ?,
            identifiant = ?,
            identifiant = ?,
            code = ?,
            grade = ?,
            telephone = ?,
            statut = ?,

            badge = ?,
            dateEntree = ?,
            superieur = ?,
            datePromotion = ?,
            notes = ?,

            etat_major = ?,
            mary_hp = ?,
            k9 = ?,
            cid = ?,
            amd = ?,
            sheriff_academy = ?

        WHERE id = ?
        `,

        [

            matricule,
            nom,
            prenom,
            identifiant,
            code,
            grade,
            telephone,
            statut,

            badge,
            dateEntree,
            superieur,
            datePromotion,
            notes,

            etat_major || 0,
            mary_hp || 0,
            k9 || 0,
            cid || 0,
            amd || 0,
            sheriff_academy || 0,

            req.params.id

        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                success:true,

                changes:this.changes

            });

        }

    );

});
// ==============================
// CHANGER UNE UNITE
// ==============================

async function changerUnite(id, colonne, valeur) {

    const agent = agents.find(a => a.id === id);

    if (!agent) return;

    agent[colonne] = valeur ? 1 : 0;

    try {

        const reponse = await fetch(
            `/api/agents/${id}`,
            {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(agent)

            }

        );

        if (!reponse.ok) {

            throw new Error();

        }

    }

    catch (erreur) {

        console.error(erreur);

        alert("Impossible de modifier l'affectation.");

        chargerAgents();

    }

}
// ==========================
// MODIFIER UNE UNITE
// ==========================

router.patch("/:id/unite", (req, res) => {

    const { colonne, valeur } = req.body;

    const colonnesAutorisees = [

        "etat_major",
        "mary_hp",
        "k9",
        "cid",
        "amd",
        "sheriff_academy"

    ];

    if (!colonnesAutorisees.includes(colonne)) {

        return res.status(400).json({

            success: false,

            message: "Colonne invalide."

        });

    }

    db.run(

        `UPDATE agents
         SET ${colonne} = ?
         WHERE id = ?`,

        [

            valeur ? 1 : 0,

            req.params.id

        ],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                success:true,

                changes:this.changes

            });

        }

    );

});

// ==========================
// SUPPRIMER UN AGENT
// ==========================

router.delete("/:id", (req, res) => {

    db.run(

        "DELETE FROM agents WHERE id = ?",

        [req.params.id],

        function(err){

            if(err){

                return res.status(500).json(err);

            }

            res.json({

                success:true,

                changes:this.changes

            });

        }

    );

});
router.get("/migration/identifiants", (req, res) => {

    db.run("ALTER TABLE agents ADD COLUMN identifiant TEXT", () => {

        db.run("ALTER TABLE agents ADD COLUMN code TEXT", () => {

            db.all("SELECT id, nom, matricule FROM agents", (err, rows) => {

                if (err) return res.status(500).json(err);

                let restant = rows.length;

                if (restant === 0) {
                    return res.json({
                        success: true
                    });
                }

                rows.forEach(agent => {

                    db.run(
                        "UPDATE agents SET identifiant = ?, code = ? WHERE id = ?",
                        [
                            agent.nom,
                            "BCSO" + agent.matricule,
                            agent.id
                        ],
                        () => {

                            restant--;

                            if (restant === 0) {

                                res.json({
                                    success: true,
                                    message: "Identifiants créés."
                                });

                            }

                        }
                    );

                });

            });

        });

    });

});
router.get("/migration/identifiants", (req, res) => {

    db.run("ALTER TABLE agents ADD COLUMN identifiant TEXT", () => {

        db.run("ALTER TABLE agents ADD COLUMN code TEXT", () => {

            db.all("SELECT id, nom, matricule FROM agents", (err, rows) => {

                if (err) {
                    return res.status(500).json(err);
                }

                let restant = rows.length;

                if (restant === 0) {
                    return res.json({
                        success: true,
                        message: "Aucun agent."
                    });
                }

                rows.forEach(agent => {

                    db.run(
                        "UPDATE agents SET identifiant = ?, code = ? WHERE id = ?",
                        [
                            agent.nom,
                            "BCSO" + agent.matricule,
                            agent.id
                        ],
                        (err2) => {

                            if (err2) {
                                console.error(err2);
                            }

                            restant--;

                            if (restant === 0) {
                                res.json({
                                    success: true,
                                    message: "Migration terminée."
                                });
                            }

                        }
                    );

                });

            });

        });

    });

});
router.get("/corriger-identifiants", (req, res) => {

    db.run(`
        UPDATE agents
        SET identifiant = nom
        WHERE identifiant IS NULL
           OR identifiant = ''
    `, function(err){

        if(err){
            return res.status(500).json(err);
        }

        res.json({
            success: true,
            message: "Identifiants corrigés."
        });

    });

});
router.get("/migration/archive", (req, res) => {

    db.run(
        "ALTER TABLE agents ADD COLUMN archive INTEGER DEFAULT 0",
        (err) => {

            if (err) {
                console.log(err.message);
            }

            res.json({
                success: true,
                message: "Colonne archive créée."
            });

        }

    );

});
// ==========================
// ARCHIVER UN AGENT
// ==========================

router.put("/:id/archive", (req, res) => {

    db.run(
        `
        UPDATE agents
        SET archive = 1
        WHERE id = ?
        `,
        [req.params.id],
        function(err) {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                success: true,
                message: "Agent archivé avec succès."
            });

        }

    );

});
module.exports = router;

