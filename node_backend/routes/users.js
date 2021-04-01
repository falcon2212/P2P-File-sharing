const router = require('express').Router();
let User = require('../models/user.model');

// Read
router.route('/').get((req, res) => {
    User.find()
    .then(users => res.json(users))
    .catch(err => res.status(400).json('Error: '+err));
});
router.route('/:id').get((req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json('Error: '+err));
});
// Create
router.route('/add').post((req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const newUser = new User({username, email, password});
    newUser.save()
    .then(() => res.json("User added."))
    .catch(err => res.status(400).json('Error: '+err));
});
// Delete
router.route('/:id').delete((req, res) => {
    const id = req.params.id;
    User.findByIdAndDelete(id)
    .then(() => res.json("User deleted."))
    .catch(err => res.status(400).json('Error: '+err));
});
// Update
router.route('/update/:id').post((req, res) => {
    const id = req.params.id;
    User.findById(id)
    .then(user => {
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = req.body.password;
        user.save()
        .then(() => res.json("User updated"))
        .catch(err => res.status(400).json('Error: '+err));
    })
    .catch(err => res.status(400).json('Error: '+err));
});

module.exports = router; 