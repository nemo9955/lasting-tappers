'use strict';
    // Include our "db"
    var db = require('../../config/db')();
    // Exports all the functions to perform on the db
    module.exports = {save, getOne, getAll};


    //POST / operationId
    function save(req, res, next) {
        res.json({success: db.save(req.body), description: "Room added to the list!"});
    }
    //GET /{id} operationId
    function getOne(req, res, next) {
        var id = req.swagger.params.id.value; //req.swagger contains the path parameters
        var room = db.find(id);
        if(room) {
            res.json(room);
        }else {
            res.status(204).send();
        }       
    }

    //GET /room operationId
    function getAll(req, res, next) {
      res.json({ rooms: db.find()});
    }