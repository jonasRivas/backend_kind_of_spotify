'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) {

    var songId = req.params.id;

    Song.findById(songId).populate({ path: 'album' }).exec((err, song) => {
        if (err) {
            res.status(500).send({ message: 'Error en la peticion' });
        } else {
            if (!song) {
                res.status(404).send({ message: 'Song no existe' });
            } else {
                res.status(200).send({ song });
            }
        }
    });
}

function saveSong(req, res) {
    var song = new Song;

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = 'null';
    song.album = params.album;

    song.save((err, songStored) => {
        if (err) {
            res.status(500).send({ message: 'Error al guardar el song' });
        } else {
            if (!songStored) {
                res.status(404).send({ message: 'El songa no ha sido guardado' });
            } else {
                res.status(200).send({ song: songStored });
            }
        }
    });
}

function getSongs(req, res) {
    var albumId = req.params.album;

    if (!albumId) {
        var find = Song.find({}).sort('number');
    } else {
        var find = Song.find({ album: albumId }).sort('number');
    }

    find.populate({
         path: 'album',
        populate : {
            path: 'artist',
            model: 'Artist'
        }       
        }).exec((err, songs) => {
            if (err) {
                res.status(500).send({ message: 'Error en la petición' });
            } else {
                if (!songs) {
                    res.status(404).send({ message: 'No hay canciones' });
                } else {
                    res.status(200).send({ songs });
                }
             }
    });
}

function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if (err) {
            res.status(500).send({ message: 'Error al actualizar el song' });
        } else {
            if (!songUpdated) {
                res.status(404).send({ message: 'El song no ha sido actualizado' });
            } else {
                res.status(200).send({ song: songUpdated });
            }
        }
    });
}

function deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {    
        if (err) {
            res.status(500).send({ message: 'Error al eliminar la canción' });
        } else {
            if (!songRemoved) {
                res.status(404).send({ message: 'La canción no ha sido eliminada' });
            } else {
                res.status(200).send({ song: songRemoved });
            }
        }
    });
}

function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = "No Subido...";

    if (req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        if (file_ext.toLowerCase() == 'mp3' || file_ext.toLowerCase() == 'ogg') {
            Song.findByIdAndUpdate(songId, { file: file_name }, (err, songUpdated) => {
                if (!songUpdated) {
                    res.status(404).send({ message: 'No se ha podido actualizar la song' })
                } else {
                    console.log("cayoaqui");
                    
                    res.status(200).send({ song: songUpdated });
                }
            });
        } else {
            res.status(200).send({ message: 'Extensión del archivo no valida' })
        }
    } else {
        res.status(200).send({ message: 'No has subido ninguna cancion...' })
    }
};

function getSongFile(req, res) {
    var imageFile = req.params.songFile;
    var path_file = './uploads/songs/' + imageFile;

    fs.exists(path_file, function (exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'No existe la cancion...' });
        }
    });
}

module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}
