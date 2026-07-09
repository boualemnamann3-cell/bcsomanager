async function connexion() {

    const username = document.getElementById("username").value;

    const password = document.getElementById("password").value;

    try {

        const reponse = await fetch("/api/auth/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                username,
                password
            })

        });

        const data = await reponse.json();

        if (!data.success) {

            alert("❌ Identifiant ou mot de passe incorrect.");

            return;

        }

        localStorage.setItem("utilisateur", JSON.stringify(data.user));

        window.location.href = "dashboard.html";

    } catch (erreur) {

        console.error(erreur);

        alert("Impossible de contacter le serveur.");

    }

}

