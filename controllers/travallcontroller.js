const router = require('express').Router();
const Travall = require('../db').import('../models/travall');
const User = require('../db').import('../models/user');

//WORKS
router.post('/create', (req, res) => {
    Travall.create({
        title: req.body.title,
        location: req.body.location,
        type: req.body.type,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    })
        .then(travall => {
            travall.addUser(req.user.id);
            res.json({ newtravall: travall });
        },
            err => { res.send(500, err.message); });
});

//WORKS
router.post('/adduser/:travallid', (req, res) => {
    Travall.findById(req.params.travallid)
        .then(travall => {
            User.findOne({ where: { email: req.body.newUser.email } })
                .then(user => {
                    travall.addUser(user.id)
                })
                .then(data => { res.json({ newUser: data }); },
                    err => { res.send(500, err.message); });
        });
});
//REQUEST TO SEND TO ABOVE FUNCTION:
// {
//"newUser": {
//"email": "<entered email>"
// }
// }

//WORKS
router.delete('/dropuser/:travallid/:userid', (req, res) => {
    Travall.findById(req.params.travallid)
        .then(travall => {
            User.findOne({ where: { id: req.params.userid } })
                .then(user => {
                    travall.removeUser(user)
                })
                .then(data => { res.json({ dropped: data }); },
                    err => { res.send(500, err.message); });
        });
});
//REQUEST TO SEND TO ABOVE FUNCTION:
// {
//"dropUser": {
//"thisTravallID": "<integer>",
//"userID": "id of user to drop"
// }
// }

//WORKS
router.delete('/dropself/:id', (req, res) => {
    Travall.findById(req.params.id)
        .then(travall => {
            User.findOne({ where: { id: req.user.id } })
                .then(user => {
                    travall.removeUser(user.id)
                })
                .then(data => { res.json({ dropped: data }); },
                    err => { res.send(500, err.message); });
        });
});

//WORKS
router.get('/getall', (req, res) => {
    Travall.findAll({
        include: {
            model: User,
            where: { id: req.user.id }
        }
    })
        .then(data => {
            console.log(data);
            res.json(data);
        },
            err => { res.send(500, err.message); });
});


router.put('/update/:id', (req, res) => {
    Travall.update({
        title: req.body.title,
        location: req.body.location,
        type: req.body.type,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    },
        { where: { id: req.params.id } }
    )
        .then(data => {
            res.json({ travallupdate: data });
        },
            err => { res.send(500, err.message); });
});

module.exports = router;