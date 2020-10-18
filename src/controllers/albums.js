const e = require('express');
// exports.create = (req, res) => {
//     res.sendStatus(201);
//   };

const { Album, Artist } = require('../models');

exports.create = (req, res) => {
    Artist.findByPk(req.params.id)
    .then(artist => {
        if(artist) {
            Album.create({
                ...req.body,
                artistId: req.params.id
            }).then(album => {
                res.status(201).json(album)});
        } else {
            res.status(404).json({ error: 'The artist could not be found.'})
        }
    })
};

exports.list = (req, res) => {
    Album.findAll({
        where: {
            artistId: req.params.id
        }
    }).then(albums => res.status(200).json(albums))
};

exports.find = (req, res) => {
    Album.findByPk(req.params.id).then(album => album ? res.status(200).json(album) : res.status(404).json({ error: 'the album could not be found.'}))
};

exports.update = (req, res) => {
    const { id } = req.params
    Album.findByPk(id).then(album => {
        if (album) {
            Album.update(req.body, { where: { id }})
            .then(album => res.status(200).json(album))
        } else {
            res.status(404).json({ error: 'the album could not be found.'})
        }
    })
}

exports.delete = (req, res) => {
    const { id } = req.params
    Album.findByPk(id).then(album => {
        if (album) {
            Album.destroy({ where: { id }})
            .then(album => res.status(204).json(album))
        } else {
            res.status(404).json({ error: 'the album could not be found.'})
        }
    })
}