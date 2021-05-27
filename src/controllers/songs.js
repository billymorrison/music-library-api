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

