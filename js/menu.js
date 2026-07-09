// =====================================
// MENU COMMUN BCSO + PERMISSIONS
// =====================================

window.addEventListener("DOMContentLoaded", async () => {

    const emplacement = document.getElementById("sidebar");

    if (!emplacement) return;


    try {

        const reponse = await fetch("modules/sidebar.html");

        emplacement.innerHTML = await reponse.text();


        // ==============================
        // GESTION DES DROITS
        // ==============================

        const utilisateur = JSON.parse(
            localStorage.getItem("utilisateur")
        );


        if (!utilisateur) {

            return;

        }


        const role = utilisateur.role;


        // Rôles autorisés à modifier

        const commandement = [
            "Sheriff",
            "Undersheriff",
            "Captain"
        ];


        // Si pas commandement

        if (!commandement.includes(role)) {


            const administration =
                document.getElementById("menu-administration");


            if (administration) {

                administration.style.display = "none";

            }


        }


    } catch (erreur) {

        console.error(
            "Impossible de charger le menu :",
            erreur
        );

    }

});

