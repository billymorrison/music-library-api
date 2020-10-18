const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app');
const { Artist, Album } = require('../src/models');

describe('/albums', () => {
  let artist;

  before(async () => {
    try {
      await Artist.sequelize.sync();
      await Album.sequelize.sync();
    } catch (err) {
      console.log(err);
    }
  });

  beforeEach(async () => {
    try {
      await Artist.destroy({ where: {} });
      await Album.destroy({ where: {} });
      artist = await Artist.create({
        name: 'Tame Impala',
        genre: 'Rock',
      });
    } catch (err) {
      console.log(err);
    }
  });

  describe('POST /artists/:artistId/albums', () => {
    it('creates a new album for a given artist', (done) => {
      request(app)
        .post(`/artists/${artist.id}/albums`)
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(201);

          Album.findByPk(res.body.id, { raw: true }).then((album) => {
            expect(album.name).to.equal('InnerSpeaker');
            expect(album.year).to.equal(2010);
            expect(album.artistId).to.equal(artist.id);
            done();
          });
        });
    });

    it('returns a 404 and does not create an album if the artist does not exist', (done) => {
      request(app)
        .post('/artists/1234/albums')
        .send({
          name: 'InnerSpeaker',
          year: 2010,
        })
        .then((res) => {
          expect(res.status).to.equal(404);
          expect(res.body.error).to.equal('The artist could not be found.');

          Album.findAll().then((albums) => {
            expect(albums.length).to.equal(0);
            done();
          });
        });
    });
  });

  describe('with albums in the database', () => {
    let albums;
    beforeEach((done) => {
      Promise.all([
        Album.create({ name: 'Bogdan', year: 1292}).then(album => {
            album.setArtist(1, {save:false})
            return album.save()
        }),
        Album.create({ name: 'Billbob', year: 1363}).then(album => {
            album.setArtist(1, {save:false})
            return album.save()
        }),
        Album.create({ name: 'Brodbank', year: 2023}).then(album => {
            album.setArtist(1, {save:false})
            return album.save()
        }),
      ]).then((documents) => {
        albums = documents;
        done();
      });
    });

    describe('GET /artists/:id/albums', () => {
      it('gets all album records for a specified artist', (done) => {
        request(app)
          .get('/artists/1/albums')
          .then((res) => {
            expect(res.status).to.equal(200);
            expect(res.body.length).to.equal(3);
            done();
          });
      });
    });
    describe('GET /albums/:id', () => {
        it('gets album record by id', (done) => {
          const album = albums[0];
          request(app)
            .get(`/albums/${album.id}`)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(res.body.name).to.equal(album.name);
              expect(res.body.year).to.equal(album.year);
              done();
            });
        });
        it('returns a 404 if the album does not exist', (done) => {
            request(app)
              .get('/albums/12345')
              .then((res) => {
                expect(res.status).to.equal(404);
                expect(res.body.error).to.equal('the album could not be found.');
                done();
              });
          });
    
    });
    describe('PATCH /album/:id', () => {
        it('updates album year by id', (done) => {
          const album = albums[0];
          request(app)
            .patch(`/albums/${album.id}`)
            .send({ year: 1201 })
            .then((res) => {
              expect(res.status).to.equal(200);
              Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                expect(updatedAlbum.year).to.equal(1201);
                done();
              });
            });
        });
        it('updates album name by id', (done) => {  
            const album = albums[0];
            request(app)
              .patch(`/albums/${album.id}`)
              .send({ name: 'Queen' })
              .then((res) => {
                expect(res.status).to.equal(200);
                Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                  expect(updatedAlbum.name).to.equal('Queen');
                  expect(updatedAlbum.year).to.equal(album.year);
                  
                });
                done();
              });
        });
        it('returns a 404 if the album does not exist', (done) => {
            request(app)
              .patch('/albums/123456')
              .send({ year: 1 })
              .then((res) => {
                expect(res.status).to.equal(404);
                expect(res.body.error).to.equal('the album could not be found.');
              });
            done();
        });
    });
    describe('DELETE /albums/:id', () => {
        it('deletes album record by id', (done) => {
            const album = albums[0];
            request(app)
            .delete(`/albums/${album.id}`)
            .then((res) => {
                expect(res.status).to.equal(204);
                Album.findByPk(album.id, { raw: true }).then((updatedAlbum) => {
                expect(updatedAlbum).to.equal(null);
                done();
                });
            });
        });
        it('returns a 404 if the album does not exist', (done) => {
            request(app)
              .delete('/albums/123456')
              .then((res) => {
                expect(res.status).to.equal(404);
                expect(res.body.error).to.equal('the album could not be found.');
              });
            done();
        });
    });  
    
})
});