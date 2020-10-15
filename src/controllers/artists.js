// exports.create = (req, res) => {
//     res.sendStatus(201);
//   };

const { Artist } = require('../models');

exports.create = (req, res) => {
    Artist.create(req.body).then(artist => res.status(201).json(artist));
};