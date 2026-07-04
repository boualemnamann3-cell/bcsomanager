async function chargerDashboard() {

    const response = await fetch("data/agents.json");
    const agents = await response.json();

    document.getElementById("nbAgents").textContent = agents.length;

}

window.onload = chargerDashboard;