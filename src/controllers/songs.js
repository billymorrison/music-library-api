const e = require('express');

const { Album, Song, Artist } = require('../models');

exports.create = (req, res) => {
    Album.findByPk(req.params.id)
    .then(album => {
        if(album) {
            console.log('if statement')
            Song.create({
                ...req.body,
                albumId: Number(req.params.id),
                artistId: req.body.artist
            }).then(song => res.status(201).json(song));
        } else {
            console.log('else statement')
            res.status(404).json({ error: 'The album could not be found.'})
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