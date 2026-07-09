const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", (req, res) => {

    const { username, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE username = ? AND password = ?",
        [username, password],
        (err, user) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "Identifiant ou mot de passe incorrect."
                });
            }

            res.json({
                success: true,
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role
                }
            });

        }
    );

});

module.exports = router;