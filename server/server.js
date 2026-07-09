const rapportsRoutes = require("./routes/rapports");
const express = require("express");
const cors = require("cors");
const path = require("path");


require("./db");

const candidatureRoutes = require("./routes/candidatures");
const authRoutes = require("./routes/auth");
const agentRoutes = require("./routes/agents");
const cleanRoutes = require("./routes/clean");
const unitesRoutes = require("./routes/unites");
const armesRoutes = require("./routes/armes");
const attributionRoutes = require("./routes/attributions");
const infractionsRoutes = require("./routes/infractions");

const app = express();

// ==========================
// MIDDLEWARES
// ==========================

app.use(cors());
app.use(express.json());
app.use("/api/infractions", infractionsRoutes);
// ==========================
// API
// ==========================

app.use("/api/candidatures", candidatureRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/clean", cleanRoutes);
app.use("/api/unites", unitesRoutes);
app.use("/api/armes", armesRoutes);
app.use("/api/rapports", rapportsRoutes);
app.use("/api/attributions", attributionRoutes);
app.use("/api/infractions", infractionsRoutes);
// ==========================
// FICHIERS STATIQUES
// ==========================

app.use(express.static(path.join(__dirname, "..")));

// ==========================
// PAGE D'ACCUEIL
// ==========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "login.html"));
});

// ==========================
// LANCEMENT SERVEUR
// ==========================

const PORT = 3000;
console.log("✅ SERVER BCSO CHARGÉ");
app.listen(PORT, () => {
    console.log(`🚔 Serveur démarré : http://localhost:${PORT}`);
});