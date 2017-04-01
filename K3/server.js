/**
 * Created by Koffman on 4/1/2017.
 */

// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://admin:password@olympia.modulusmongo.net:27017/nIqopo2z');     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());

// Mongoose Schema definition
var Schema = mongoose.Schema;

// define model =================
var AnimalSchema = new Schema({
    animalName: {
        type: String,
        unique: true
    },
    animalType: String
});

var SightingSchema = new Schema({
    sightingName: {
        type: String,
        index: {
            unique: true
        }
    },
    sightingAnimal: [{type: mongoose.Schema.Types.ObjectId, ref: 'AnimalSchema'}],
    sightingLocation: String,
    sightingTime: String
});

// Mongoose Model definition
var Animal = mongoose.model('AnimalModel', AnimalSchema);
var Sighting = mongoose.model('SightingModel', SightingSchema);


/*var Animal = mongoose.model('Animal', {
    animalName: {
        type: String,
        index: {
            unique: true
        }
    },
    animalType: String
});

var Sighting = mongoose.model('Animal', {
    sightingName: {
        type: String,
        index: {
            unique: true
        }
    },
    animal: String,
    location: String,
    sightingTime: Date
});*/

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all animals
app.get('/api/animals', function (req, res) {

    // use mongoose to get all animals in the database
    Animal.find(function (err, animals) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(animals); // return all animals in JSON format
    });
});

// create animal and send back all animals after creation
app.post('/api/animals', function (req, res) {

    // create a animal, information comes from AJAX request from Angular
    Animal.create({
        animalName: req.body.animalName,
        animalType: req.body.animalType,
        done: false
    }, function (err, animal) {
        if (err) {
            console.log(err);
            //res.send(err);
        } else {
            // get and return all the animals after you create another
            Animal.find(function (err, animals) {
                if (err) {
                    //res.send(err);
                } else {
                    res.json(animals);
                }
            });
        }
    });

});

// delete an animal
app.delete('/api/animals/:animal_id', function (req, res) {
    Animal.remove({
        _id: req.params.animal_id
    }, function (err, animal) {
        if (err)
            res.send(err);

        // get and return all the animals after you create another
        Animal.find(function (err, animals) {
            if (err)
                res.send(err)
            res.json(animals);
        });
    });
});

// get all sightings
app.get('/api/sightings', function (req, res) {

    // use mongoose to get all sightings in the database
    Sighting.find(function (err, sightings) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(sightings); // return all sightings in JSON format
    });
});

// create sighting and send back all sightings after creation
app.post('/api/sightings', function (req, res) {

    // create a sighting, information comes from AJAX request from Angular
    Sighting.create({
        sightingName: req.body.sightingName,
        sightingAnimal: req.body.sightingAnimal,
        sightingLocation: req.body.sightingLocation,
        sightingTime: req.body.sightingTime,
        done: false
    }, function (err, sighting) {
        if (err) {
            console.log(err);
            //res.send(err);
        } else {
            // get and return all the animals after you create another
            Sighting.find(function (err, sightings) {
                if (err) {
                    //res.send(err);
                } else {
                    res.json(sightings);
                }
            });
        }
    });

});

// delete a sighting
app.delete('/api/sightings/:sighting_id', function (req, res) {
    Sighting.remove({
        _id: req.params.sighting_id
    }, function (err, sighting) {
        if (err)
            res.send(err);

        // get and return all the animals after you create another
        Sighting.find(function (err, sightings) {
            if (err)
                res.send(err)
            res.json(sightings);
        });
    });
});

// application -------------------------------------------------------------
app.get('*', function (req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");