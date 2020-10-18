const { Artist } = require('../models');

exports.create = (req, res) => {
    Artist.create(req.body).then(artist => res.status(201).json(artist));
};

exports.list = (req, res) => {
    Artist.findAll({}).then(artists => res.status(200).json(artists))
};

exports.find = (req, res) => {
    Artist.findByPk(req.params.id).then(artist => artist ? res.status(200).json(artist) : res.status(404).json({ error: 'the artist could not be found.'}))
};

exports.update = (req, res) => {
    const { id } = req.params
    Artist.findByPk(id).then(artist => {
        if (artist) {
            Artist.update(req.body, { where: { id }})
            .then(artist => res.status(200).json(artist))
        } else {
            res.status(404).json({ error: 'the artist could not be found.'})
        }
    })
}

exports.delete = (req, res) => {
    const { id } = req.params
    Artist.findByPk(id).then(artist => {
        if (artist) {
            Artist.destroy({ where: { id }})
            .then(artist => res.status(204).json(artist))
        } else {
            res.status(404).json({ error: 'the artist could not be found.'})
        }
    })
}