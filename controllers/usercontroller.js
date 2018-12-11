const router = require('express').Router();
const User = require('../db').import('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res) => {
    User.create({
        email: req.body.user.email,
        username: req.body.user.username,
        password: bcrypt.hashSync(req.body.user.password, 10),
        color: req.body.user.color
    })
        .then(
            user => {
                let token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 60 * 60 * 24 });
                res.json({
                    user: user,
                    message: 'User created',
                    sessionToken: token
                });
            },
            err => res.send(500, err)
        );
});

router.post('/login', (req, res) => {
    User.findOne({ where: { username: req.body.user.username } })
        .then(user => {
            if (user) {
                bcrypt.compare(req.body.user.password, user.password, (err, matches) => {
                    if (matches) {
                        let token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 60 * 60 * 24 });
                        res.json({
                            user: user,
                            message: "Successfully authenticated.",
                            sessionToken: token
                        });
                    } else {
                        res.status(502).send({ error: "Passwords do not match." });
                    }
                });
            } else {
                res.status(403).send({ error: "User not found." });
            }
        });
});

module.exports = router;