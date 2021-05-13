var express = require('express');
var router = express.Router();

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
router.route('/find').post((req, res) => {
    User.findOne({username: req.body.username, password: req.body.password})
        .then(user => {
            res.json(user);
            console.log(user);
        })
        .catch(err => res.status(400).json('Error: '+err));
});
// Create
router.route('/add').post((req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
  const room = Math.floor((1 + Math.random()) * 1e16).toString(16).substring(1);
  const newUser = new User({username, email, password, name, room});
  newUser.save()
      .then(() => res.json(newUser))
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
        user.name = req.body.name;
        user.devices = req.body.devices;
        user.save()
            .then(() => res.json("User updated"))
            .catch(err => res.status(400).json('Error: '+err));
      })
      .catch(err => res.status(400).json('Error: '+err));
});

router.route('/update_devices/:id').post((req, res) => {
    const id = req.params.id;
    console.log("Phuckkk");
    console.log(id);
    User.findById(id)
        .then(user => {
            console.log(user, req.body);
            user.devices = req.body.devices;
            user.save()
                .then((user) => {console.log(user);res.json(user)})
                .catch(err => res.status(400).json('Error: '+err));
        })
        .catch(err => res.status(400).json('Error: '+err));
});

module.exports = router;