const db = require("./db");

const agents = [

{ matricule:"406", nom:"Tom Carlson", grade:"Sheriff", service:"Commandement", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"301", nom:"Tom Benali", grade:"Sheriff Adjoint", service:"Commandement", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"000", nom:"Nio", grade:"Commandant", service:"Commandement", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"321", nom:"Hugo Kingslay", grade:"Capitaine", service:"Commandement", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"398", nom:"Dorian Vasqueze", grade:"Sergeant I", service:"Patrouille", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"339", nom:"Dante Moretti", grade:"Deputy II", service:"Patrouille", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"300", nom:"Koda Pereira", grade:"Deputy I", service:"Patrouille", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"303", nom:"Kraven Volkov", grade:"Deputy I", service:"Patrouille", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"323", nom:"Jayden Rousvelt", grade:"Deputy I", service:"Patrouille", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"304", nom:"Joseph Pato", grade:"Rookie", service:"Académie", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"344", nom:"Tyler Brooklyn", grade:"Rookie", service:"Académie", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"322", nom:"Warren Sivilio", grade:"Rookie", service:"Académie", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"354", nom:"Arthuros Garcia", grade:"Rookie", service:"Académie", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"355", nom:"Bob Jamal", grade:"Rookie", service:"Académie", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"401", nom:"Tony Callaverra", grade:"Rookie", service:"Académie", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"402", nom:"Robert McBook", grade:"Rookie", service:"Académie", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"404", nom:"Juarez Garcia", grade:"Rookie", service:"Académie", telephone:"", statut:"En service", dateEntree:"" },
{ matricule:"412", nom:"Sala Eric", grade:"Rookie", service:"Académie", telephone:"", statut:"En service", dateEntree:"" }

];
db.run("DELETE FROM agents", (err) => {

    if (err) {
        console.error(err);
        return;
    }
db.run("DELETE FROM agents", (err) => {

    if (err) {
        console.error(err);
        return;
    }

    console.log("🗑️ Anciens agents supprimés.");

    agents.forEach(agent => {
    agents.forEach(agent => {

        db.run(
            `INSERT INTO agents
            (matricule, nom, grade, service, telephone, statut, dateEntree)
            VALUES (?,?,?,?,?,?,?)`,
            [
                agent.matricule,
                agent.nom,
                agent.grade,
                agent.service,
                agent.telephone,
                agent.statut,
                agent.dateEntree
            ]
        );

    });

    console.log("✅ Tous les agents ont été réimportés.");

});

agents.forEach(agent => {

    db.run(
        `INSERT INTO agents
        (matricule, nom, grade, service, telephone, statut, dateEntree)
        VALUES (?,?,?,?,?,?,?)`,
        [
            agent.matricule,
            agent.nom,
            agent.grade,
            agent.service,
            agent.telephone,
            agent.statut,
            agent.dateEntree
        ]
    );

});

console.log("✅ Tous les agents ont été importés.");
    });

    console.log("✅ Tous les agents ont été importés.");

});

