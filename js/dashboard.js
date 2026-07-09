const utilisateur = JSON.parse(localStorage.getItem("utilisateur"));

if (!utilisateur) {

    window.location.href = "login.html";

}
// =====================================
// BCSO MANAGER - DASHBOARD
// =====================================

let agents = [];
let armes = [];
let vehicules = [];
let rapports = [];
let casiers = [];

// ==============================
// Démarrage
// ==============================

window.onload = async function () {

    await chargerDonnees();

    mettreAJourCompteurs();

    afficherDerniersAgents();

    afficherActivite();

    afficherAnnonces();

    lancerHorloge();

    creerGraphique();

};

// ==============================
// Chargement des données
// ==============================

async function chargerDonnees() {

    agents = await chargerJSON("data/agents.json");
    armes = await chargerJSON("data/armes.json");
    vehicules = await chargerJSON("data/vehicules.json");
    rapports = await chargerJSON("data/rapports.json");
    casiers = await chargerJSON("data/casiers.json");

}

async function chargerJSON(fichier) {

    try {

        const response = await fetch(fichier);

        if (!response.ok) return [];

        return await response.json();

    } catch {

        return [];

    }

}

// ==============================
// Compteurs
// ==============================

function mettreAJourCompteurs() {

    document.getElementById("nbAgents").textContent = agents.length;

    document.getElementById("nbArmes").textContent = armes.length;

    document.getElementById("nbVehicules").textContent = vehicules.length;

    document.getElementById("nbRapports").textContent = rapports.length;

    document.getElementById("nbCasiers").textContent = casiers.length;

    const enService = agents.filter(a => a.service === true).length;

    document.getElementById("nbService").textContent = enService;

}// ==============================
// Horloge
// ==============================

function lancerHorloge() {

    mettreAJourHeure();

    setInterval(mettreAJourHeure, 1000);

}

function mettreAJourHeure() {

    const maintenant = new Date();

    const heure = maintenant.toLocaleTimeString("fr-FR");

    const date = maintenant.toLocaleDateString("fr-FR", {

        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"

    });

    document.getElementById("heure").textContent = heure;

    document.getElementById("date").textContent = date;

}

// ==============================
// Derniers agents
// ==============================

function afficherDerniersAgents() {

    const liste = document.getElementById("listeAgents");

    liste.innerHTML = "";

    if (agents.length === 0) {

        liste.innerHTML = "<p>Aucun agent enregistré.</p>";

        return;

    }

    const derniers = [...agents].reverse().slice(0, 5);

    derniers.forEach(agent => {

        const div = document.createElement("div");

        div.className = "item";

        div.innerHTML = `
            <strong>${agent.nom}</strong>
            <span>${agent.grade}</span>
        `;

        liste.appendChild(div);

    });

}

// ==============================
// Activité récente
// ==============================

function afficherActivite() {

    const bloc = document.getElementById("activiteRecente");

    bloc.innerHTML = "";

    const activites = [

        "✔ Dashboard chargé",

        `${agents.length} agents enregistrés`,

        `${armes.length} armes disponibles`,

        `${vehicules.length} véhicules référencés`,

        `${rapports.length} rapports enregistrés`

    ];

    activites.forEach(texte => {

        const div = document.createElement("div");

        div.className = "item";

        div.innerHTML = `<strong>${texte}</strong>`;

        bloc.appendChild(div);

    });

}// ==============================
// Graphique
// ==============================

function creerGraphique() {

    const canvas = document.getElementById("graphique");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {

        type: "bar",

        data: {

            labels: [

                "Agents",
                "Armes",
                "Véhicules",
                "Rapports",
                "Casiers"

            ],

            datasets: [{

                label: "BCSO",

                data: [

                    agents.length,
                    armes.length,
                    vehicules.length,
                    rapports.length,
                    casiers.length

                ],

                backgroundColor: [

                    "#d4af37",
                    "#3498db",
                    "#2ecc71",
                    "#9b59b6",
                    "#e74c3c"

                ],

                borderRadius: 10

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "#2f3a4d"

                    }

                },

                x: {

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        display: false

                    }

                }

            }

        }

    });

}

// ==============================
// Dernières annonces
// ==============================

function afficherAnnonces() {

    const bloc = document.getElementById("annonces");

    if (!bloc) return;

    bloc.innerHTML = `

        <div class="item">
            <strong>📢 Bienvenue sur BCSO Manager</strong>
        </div>

        <div class="item">
            <strong>👮 Pensez à mettre à jour les dossiers agents.</strong>
        </div>

        <div class="item">
            <strong>🔫 Vérifiez régulièrement les stocks de l'armurerie.</strong>
        </div>

    `;

}// ==============================
// Graphique
// ==============================

function creerGraphique() {

    const canvas = document.getElementById("graphique");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {

        type: "bar",

        data: {

            labels: [

                "Agents",
                "Armes",
                "Véhicules",
                "Rapports",
                "Casiers"

            ],

            datasets: [{

                label: "BCSO",

                data: [

                    agents.length,
                    armes.length,
                    vehicules.length,
                    rapports.length,
                    casiers.length

                ],

                backgroundColor: [

                    "#d4af37",
                    "#3498db",
                    "#2ecc71",
                    "#9b59b6",
                    "#e74c3c"

                ],

                borderRadius: 10

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        color: "#2f3a4d"

                    }

                },

                x: {

                    ticks: {

                        color: "#ffffff"

                    },

                    grid: {

                        display: false

                    }

                }

            }

        }

    });

}

// ==============================
// Dernières annonces
// ==============================

function afficherAnnonces() {

    const bloc = document.getElementById("annonces");

    if (!bloc) return;

    bloc.innerHTML = `

        <div class="item">
            <strong>📢 Bienvenue sur BCSO Manager</strong>
        </div>

        <div class="item">
            <strong>👮 Pensez à mettre à jour les dossiers agents.</strong>
        </div>

        <div class="item">
            <strong>🔫 Vérifiez régulièrement les stocks de l'armurerie.</strong>
        </div>

    `;

}document.getElementById("nomUtilisateur").textContent =
    utilisateur.username;

document.getElementById("roleUtilisateur").textContent =
    utilisateur.role;