async function chargerComptes() {

    try {

        const reponse = await fetch("/api/agents");

        const agents = await reponse.json();

        const tbody = document.getElementById("listeComptes");

        tbody.innerHTML = "";

        agents.forEach(agent => {

            tbody.innerHTML += `

<tr>

    <td>${agent.matricule}</td>

    <td>${agent.nom}</td>

    <td>${agent.prenom}</td>

    <td>${agent.grade}</td>

    <td>${agent.identifiant}</td>

    <td>${agent.code}</td>

    <td>
        <span class="badge-statut">
            🟢 Actif
        </span>
    </td>

    <td>

        <button
            class="btn-copie"
            onclick="copier('${agent.identifiant}')">

            <i class="fa-solid fa-user"></i>

        </button>

        <button
            class="btn-copie"
            onclick="copier('${agent.code}')">

            <i class="fa-solid fa-key"></i>

        </button>

    </td>

</tr>

`;

        });

    } catch (e) {

        console.error(e);

    }

}

function copier(valeur) {

    navigator.clipboard.writeText(valeur);

    alert("Copié.");

}

chargerComptes();

