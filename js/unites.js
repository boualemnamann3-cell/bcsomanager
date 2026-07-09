/* =====================================
   BCSO MANAGER - UNITÉS
   Gestion + Permissions
===================================== */


let unites = [];


// ==============================
// DROITS UTILISATEUR
// ==============================

function estCommandement() {

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur")
    );


    if (!utilisateur) return false;


    const roles = [

        "Sheriff",
        "Undersheriff",
        "Captain"

    ];


    return roles.includes(
        utilisateur.role
    );

}



// ==============================
// INITIALISATION
// ==============================

window.onload = () => {


    chargerUnites();



    const boutonAjouter =
        document.querySelector(
            ".btn-principal"
        );


    if (
        boutonAjouter &&
        !estCommandement()
    ) {

        boutonAjouter.style.display = "none";

    }


};



// ==============================
// CHARGER LES UNITÉS
// ==============================

async function chargerUnites() {


    try {


        const reponse = await fetch(
            "/api/unites"
        );


        unites =
            await reponse.json();



        afficherUnites();



    } catch (err) {


        console.error(
            "Erreur chargement unités :",
            err
        );


    }


}// ==============================
// AFFICHER LES UNITÉS
// ==============================

function afficherUnites() {


    const liste =
        document.getElementById("listeUnites");



    if (!liste) return;



    liste.innerHTML = "";





    if (unites.length === 0) {


        liste.innerHTML = `

            <p class="center">
                Aucune unité enregistrée.
            </p>

        `;


        return;

    }





    unites.forEach(unite => {



        let actions = "";



        if (estCommandement()) {


            actions = `


            <div class="actions">


                <button
                    class="btn-action btn-refuser"
                    onclick="supprimerUnite(${unite.id})">


                    <i class="fa-solid fa-trash"></i>


                </button>


            </div>


            `;


        }





        liste.innerHTML += `


        <div class="bloc">


            <h2>

                ${unite.nom}

            </h2>



            <p>

                ${unite.description || ""}

            </p>



            <p>

                <strong>
                    Chef :
                </strong>

                ${unite.chef || "Aucun"}

            </p>



            ${actions}


        </div>


        `;



    });


}



// ==============================
// OUVRIR MODAL
// ==============================

function ouvrirModal() {


    if (!estCommandement()) {


        alert(
            "Accès réservé au commandement."
        );


        return;

    }



    document
        .getElementById("modalUnite")
        .classList
        .remove("hidden");


}



// ==============================
// FERMER MODAL
// ==============================

function fermerModal() {


    document
        .getElementById("modalUnite")
        .classList
        .add("hidden");


}// ==============================
// FORMULAIRE CRÉATION UNITÉ
// ==============================

const form = document.getElementById("formUnite");


if (form) {


    form.addEventListener(
        "submit",
        enregistrerUnite
    );


}



// ==============================
// ENREGISTRER UNE UNITÉ
// ==============================

async function enregistrerUnite(e) {


    e.preventDefault();



    if (!estCommandement()) {


        alert(
            "Accès réservé au commandement."
        );


        return;

    }





    const unite = {


        nom:
            document
            .getElementById("nomUnite")
            .value
            .trim(),



        description:
            document
            .getElementById("descriptionUnite")
            .value
            .trim(),



        chef:
            document
            .getElementById("chefUnite")
            .value
            .trim(),



        couleur:
            document
            .getElementById("couleurUnite")
            .value,



        logo:
            ""

    };





    try {



        const reponse = await fetch(

            "/api/unites",

            {

                method: "POST",


                headers: {

                    "Content-Type": "application/json"

                },


                body:
                    JSON.stringify(unite)

            }

        );





        if (!reponse.ok) {


            throw new Error();


        }





        fermerModal();


        chargerUnites();



        alert(
            "Unité créée avec succès."
        );





    } catch (err) {


        console.error(err);


        alert(
            "Impossible de créer l'unité."
        );


    }


}





// ==============================
// SUPPRIMER UNE UNITÉ
// ==============================

async function supprimerUnite(id) {


    if (!estCommandement()) {


        alert(
            "Accès réservé au commandement."
        );


        return;

    }





    if (
        !confirm(
            "Supprimer cette unité ?"
        )
    ) return;





    try {



        const reponse = await fetch(

            `/api/unites/${id}`,

            {

                method: "DELETE"

            }

        );





        if (!reponse.ok) {


            throw new Error();


        }





        chargerUnites();



        alert(
            "Unité supprimée."
        );





    } catch (err) {


        console.error(err);


        alert(
            "Impossible de supprimer l'unité."
        );


    }


}

