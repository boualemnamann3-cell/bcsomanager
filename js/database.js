// ======================================
// BCSO MANAGER - DATABASE
// ======================================

const CLE_AGENTS = "bcso_agents";

// Charger les agents
async function chargerAgents() {

    const sauvegarde = localStorage.getItem(CLE_AGENTS);

    // Si une sauvegarde existe, on l'utilise
    if (sauvegarde) {
        return JSON.parse(sauvegarde);
    }

    // Sinon on charge le fichier JSON
    const response = await fetch("data/agents.json");

    if (!response.ok) {
        throw new Error("Impossible de charger data/agents.json");
    }

    const agents = await response.json();

    // Première sauvegarde dans le navigateur
    localStorage.setItem(
        CLE_AGENTS,
        JSON.stringify(agents)
    );

    return agents;
}

// Sauvegarder les agents
function sauvegarderAgents(agents) {

    localStorage.setItem(
        CLE_AGENTS,
        JSON.stringify(agents)
    );

}

// Retour à la base d'origine
async function reinitialiserAgents() {

    localStorage.removeItem(CLE_AGENTS);

    return await chargerAgents();

}