// =====================================
// BCSO MANAGER - DOSSIER AGENT
// =====================================

const agent = JSON.parse(localStorage.getItem("agentSelectionne"));

if (!agent) {

    alert("Aucun agent sélectionné.");

    window.location.href = "agents.html";

}

// Informations principales
document.getElementById("nomAgent").textContent = agent.nom;
document.getElementById("matriculeAgent").textContent = agent.matricule;
document.getElementById("gradeAgent").textContent = agent.grade;
document.getElementById("uniteAgent").textContent = agent.unite;
document.getElementById("statutAgent").textContent = agent.statut;

document.getElementById("telephoneAgent").textContent =
agent.telephone || "Non renseigné";

document.getElementById("badgeAgent").textContent =
agent.badge || "Non attribué";

document.getElementById("dateEntreeAgent").textContent =
agent.dateEntree || "Non renseignée";

document.getElementById("emailAgent").textContent =
agent.email || "Aucun";

document.getElementById("groupeAgent").textContent =
agent.groupe || "Inconnu";

// =====================
// ARMES
// =====================

const listeArmes = document.getElementById("armes");

listeArmes.innerHTML = "";

if(agent.armes.length===0){

    listeArmes.innerHTML="<li>Aucune arme</li>";

}else{

    agent.armes.forEach(arme=>{

        listeArmes.innerHTML += `<li>🔫 ${arme}</li>`;

    });

}

// =====================
// VEHICULES
// =====================

const listeVehicules=document.getElementById("vehicules");

listeVehicules.innerHTML="";

if(agent.vehicules.length===0){

listeVehicules.innerHTML="<li>Aucun véhicule</li>";

}else{

agent.vehicules.forEach(v=>{

listeVehicules.innerHTML+=`<li>🚓 ${v}</li>`;

});

}

// =====================
// FORMATIONS
// =====================

const listeFormations=document.getElementById("formations");

listeFormations.innerHTML="";

if(agent.formations.length===0){

listeFormations.innerHTML="<li>Aucune formation</li>";

}else{

agent.formations.forEach(f=>{

listeFormations.innerHTML+=`<li>🎓 ${f}</li>`;

});

}