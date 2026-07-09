// =====================================
// BCSO MANAGER - CASIERS
// =====================================

let casiers = [];

// ==============================
// DÉMARRAGE
// ==============================

window.onload = async function () {

    chargerCasiers();

};

// ==============================
// CHARGER
// ==============================

function chargerCasiers() {

    const sauvegarde = localStorage.getItem("casiers");

    if (sauvegarde) {

        casiers = JSON.parse(sauvegarde);

    }

    afficherCasiers();

}

// ==============================
// AFFICHER
// ==============================

function afficherCasiers() {

    const tbody = document.getElementById("listeCasiers");

    tbody.innerHTML = "";

    if (casiers.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                Aucun casier enregistré.
            </td>
        </tr>
        `;

        return;

    }

    casiers.forEach((casier, index) => {

        tbody.innerHTML += `

        <tr>

            <td>${casier.numero}</td>

            <td>${casier.nom}</td>

            <td>${casier.prenom}</td>

            <td>${casier.date}</td>

            <td>${casier.infraction}</td>

            <td>

                <button class="btn-modifier"
                    onclick="modifierCasier(${index})">

                    Modifier

                </button>

                <button class="btn-supprimer"
                    onclick="supprimerCasier(${index})">

                    Supprimer

                </button>

            </td>

        </tr>

        `;

    });

}

// ==============================
// OUVRIR
// ==============================

function ouvrirCasier() {

    document.getElementById("popupCasier").style.display = "flex";

    document.getElementById("numeroCasier").value =
        "CAS-" + String(casiers.length + 1).padStart(6, "0");

}

// ==============================
// FERMER
// ==============================

function fermerCasier() {

    document.getElementById("popupCasier").style.display = "none";

}

