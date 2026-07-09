const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// =====================================
// CONNEXION SQLITE
// =====================================

const db = new sqlite3.Database(
    path.join(__dirname, "bcso.db"),
    (err) => {

        if (err) {
            console.error("❌ Erreur SQLite :", err.message);
        } else {
            console.log("✅ Base SQLite connectée");
        }

    }
);

// =====================================
// CRÉATION DES TABLES
// =====================================

db.serialize(() => {

    // ==========================
    // USERS
    // ==========================

    db.run(`
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            username TEXT UNIQUE,

            password TEXT,

            role TEXT

        )
    `);

    db.run(`
        INSERT OR IGNORE INTO users
        (id, username, password, role)

        VALUES

        (1,'admin','admin123','Sheriff')
    `);

    // ==========================
    // AGENTS
    // ==========================

    db.run(`
        CREATE TABLE IF NOT EXISTS agents (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            matricule TEXT UNIQUE,

            nom TEXT,

            grade TEXT,

            telephone TEXT,

            statut TEXT,

            badge TEXT,

            dateEntree TEXT,

            superieur TEXT,

            photo TEXT,

            datePromotion TEXT,

            notes TEXT,

            etat_major INTEGER DEFAULT 0,

            mary_hp INTEGER DEFAULT 0,

            k9 INTEGER DEFAULT 0,

            cid INTEGER DEFAULT 0,

            amd INTEGER DEFAULT 0,

            sheriff_academy INTEGER DEFAULT 0

        )
    `);    // ==========================
    // CANDIDATURES
    // ==========================

    db.run(`
        CREATE TABLE IF NOT EXISTS candidatures (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nom TEXT,
            age INTEGER,
            discord TEXT,
            tempsJeu TEXT,
            disponibilite TEXT,

            q1 TEXT,
            q2 TEXT,
            q3 TEXT,
            q4 TEXT,
            q5 TEXT,
            q6 TEXT,
            q7 TEXT,
            q8 TEXT,
            q9 TEXT,
            q10 TEXT,

            statut TEXT,

            date TEXT

        )
    `);

    // ==========================
    // UNITÉS
    // ==========================

    db.run(`
        CREATE TABLE IF NOT EXISTS unites (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nom TEXT UNIQUE,

            description TEXT,

            chef TEXT,

            logo TEXT,

            couleur TEXT

        )
    `);

    // ==========================
    // ARMURERIE
    // ==========================

    db.run(`
        CREATE TABLE IF NOT EXISTS armes (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            nom TEXT,

            type TEXT,

            calibre TEXT,

            quantite INTEGER DEFAULT 0

        )
    `);
// ==========================
// ARMURERIE
// ==========================

db.run(`
    CREATE TABLE IF NOT EXISTS armes (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        nom TEXT,

        type TEXT,

        calibre TEXT,

        quantite INTEGER DEFAULT 0

    )
`);


// ==========================
// ATTRIBUTIONS ARMES
// ==========================

db.run(`
    CREATE TABLE IF NOT EXISTS attributions_armes (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        agent_id INTEGER NOT NULL,

        arme_id INTEGER NOT NULL,

        quantite INTEGER DEFAULT 1,

        date_attribution TEXT,

        date_retour TEXT,

        statut TEXT DEFAULT 'Attribuée',

        FOREIGN KEY(agent_id) REFERENCES agents(id),

        FOREIGN KEY(arme_id) REFERENCES armes(id)

    )
`);

    // ==========================
    // MIGRATION AGENTS
    // ==========================

    const migrations = [

        "ALTER TABLE agents ADD COLUMN etat_major INTEGER DEFAULT 0",

        "ALTER TABLE agents ADD COLUMN mary_hp INTEGER DEFAULT 0",

        "ALTER TABLE agents ADD COLUMN k9 INTEGER DEFAULT 0",

        "ALTER TABLE agents ADD COLUMN cid INTEGER DEFAULT 0",

        "ALTER TABLE agents ADD COLUMN amd INTEGER DEFAULT 0",

        "ALTER TABLE agents ADD COLUMN sheriff_academy INTEGER DEFAULT 0"

    ];
// ==========================
// MIGRATION FICHE AGENT
// ==========================

const migrationsAgent = [

    "ALTER TABLE agents ADD COLUMN badge TEXT",

    "ALTER TABLE agents ADD COLUMN dateEntree TEXT",

    "ALTER TABLE agents ADD COLUMN superieur TEXT",

    "ALTER TABLE agents ADD COLUMN datePromotion TEXT",

    "ALTER TABLE agents ADD COLUMN notes TEXT"

];

migrationsAgent.forEach(sql => {

    db.run(sql, err => {

        if (
            err &&
            !err.message.includes("duplicate column")
        ) {

            console.error(err.message);

        }

    });

});
    migrations.forEach(sql => {

        db.run(sql, err => {

            if (
                err &&
                !err.message.includes("duplicate column")
            ) {

                console.error(err.message);

            }

        });

    });   
    // ==========================
// MIGRATION RAPPORTS
// ==========================

const migrationsRapports = [

    "ALTER TABLE rapports_complets ADD COLUMN archive INTEGER DEFAULT 0",

    "ALTER TABLE rapports_complets ADD COLUMN valide_par TEXT",

    "ALTER TABLE rapports_complets ADD COLUMN date_validation TEXT",

    "ALTER TABLE rapports_complets ADD COLUMN date_archivage TEXT"

];

migrationsRapports.forEach(sql => {

    db.run(sql, err => {

        if (
            err &&
            !err.message.includes("duplicate column")
        ) {

            console.error(err.message);

        }

    });

}); 
    // ==========================
    // RAPPORTS
    // ==========================

    db.run(`
        CREATE TABLE IF NOT EXISTS rapports (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            titre TEXT,

            type TEXT,

            agent TEXT,

            description TEXT,

            date TEXT

        )
    `);
// ==========================
// INFRACTIONS
// ==========================

db.run(`
    CREATE TABLE IF NOT EXISTS infractions (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        categorie TEXT,

        nom TEXT UNIQUE,

        amende INTEGER DEFAULT 0,

        prison INTEGER DEFAULT 0

    )
`);
    // ==========================
    // RAPPORTS COMPLETS
    // ==========================

    db.run(`
        CREATE TABLE IF NOT EXISTS rapports_complets (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            numero TEXT,

            date TEXT,
            heure TEXT,

            agent TEXT,
            matricule TEXT,
            grade TEXT,
            unite TEXT,

            suspect_nom TEXT,
            suspect_prenom TEXT,

            heure_menottage TEXT,

            miranda TEXT,
            heure_miranda TEXT,

            droits_demandes TEXT,

            lieu TEXT,

            fouille TEXT,
            objets_trouves TEXT,

            agents_presents TEXT,

            telephone TEXT,

            description TEXT,

            infractions TEXT,

            amende INTEGER DEFAULT 0,

            prison INTEGER DEFAULT 0,

            defcon TEXT,

            statut TEXT DEFAULT 'Brouillon',

            validation TEXT,

            commentaire TEXT,

            texte_final TEXT,

            created_at TEXT

        )
     `);

}); // Fin de db.serialize()
const migrationsRapports = [

"ALTER TABLE rapports_complets ADD COLUMN valide_par TEXT",

"ALTER TABLE rapports_complets ADD COLUMN date_validation TEXT",

"ALTER TABLE rapports_complets ADD COLUMN archive INTEGER DEFAULT 0",

"ALTER TABLE rapports_complets ADD COLUMN date_archivage TEXT"

];

migrationsRapports.forEach(sql=>{

    db.run(sql,err=>{

        if(err && !err.message.includes("duplicate")){

            console.error(err.message);

        }

    });

});
module.exports = db;