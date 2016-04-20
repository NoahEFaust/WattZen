var express = require('express');
var router = express.Router();
var path = require('path');
var pg = require('pg');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));
var requestify = require('requestify'); 
var http = require("http");
var https = require("https");
var passwordHash = require('password-hash');
var Particle = require('particle-api-js');
var particle = new Particle();
var particleToken; 


router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../', '../', 'client', 'views', 'index.html'));
});
router.get('/login', function (req, res) {
    res.render('partials/login');
});
router.get('/home', function(req, res) {
    res.render('partials/home');
});

//*** API for creating and signing in users ***//
router.post('/api/v1/user', function(req, res) {
    var userInfo = {email: req.body.email, password: req.body.password, phone: req.body.phone};

    var hashedPassword = passwordHash.generate(userInfo.password);

    pg.connect(connectionString, function(err, client, done){
         if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        client.query("INSERT INTO users(email, password, phonenumber) VALUES($1, $2, $3)", [userInfo.email, hashedPassword, userInfo.phone]); 
        res.redirect('../../home');

        //particle.login({username: userInfo.email, password: userInfo.password});

        particle.login({username: 'deepak.s.kumar.85@gmail.com', password: 'wattzen123'}).then(
          function(data){
            console.log('API call completed on promise resolve: ', data.body.access_token);
            particleToken = data.body.access_token;
          },
          function(err) {
            console.log('API call completed on promise fail: ', err);
          }
        );
    });

});

router.post('/api/v1/rmscurrent', function(req, res) {
    
    particle.getVariable({ deviceId: '39003f000247343339373536', name: 'RMScurrent', auth: 'fee27c1ec9f8c9dbd8188886f4f60c995aabfbd6' }).then(function(data) {
      //console.log('Device variable retrieved successfully:', data);

      pg.connect(connectionString, function(err, client, done){
        if(err) {
            done();
            console.log(err);
            return res.stats(500).json({success: false, data: err});
        }
        var body = data.body;
        client.query("INSERT INTO currentvalues(deviceid, timeread, rmscurrent) values($1, $2, $3)", 
            [body.coreInfo.deviceID, body.coreInfo.last_heard, body.result]);
        return res.status(200).json({ success: true, data: 'RMScurrent added!'});
      });

    }, function(err) {
      console.log('An error occurred while getting attrs:', err);
    });
});

//*** Api calls for getting energy values ***//

router.post('/api/v1/todos', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {text: req.body.text, energyvalue: 0.0};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

         requestify.get('https://api.particle.io/v1/devices/230043001347343339383037/analogvalue\?access_token=507bb79eb1ebaf88f099dede80e495efb35a83f4')
         .then(function(response) {
            // Get the response body (JSON parsed - JSON response or jQuery object in case of XML response)
            response.getBody();

            // Get the response raw body
            var body = response.body;
            var bodyJson = JSON.parse(body);
            //currentInAmps = 2000*(bodyJson.result - 1.65)/100
            data.energyvalue = 2000*(bodyJson.result - 1.65)/100;

             // SQL Query > Insert Data
            client.query("INSERT INTO devices(text, energyvalue) values($1, $2)", [data.text, data.energyvalue]);

            // SQL Query > Select Data
            var query = client.query("SELECT * FROM devices ORDER BY id ASC");

            // Stream results back one row at a time
            query.on('row', function(row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                done();
                return res.json(results);
            });
        }, function(err){
            console.log(err); 
            // SQL Query > Insert Data
            console.log('STATUS: ' + res.statuscode);
            data.energyvalue = res.statuscode;
            client.query("INSERT INTO devices(text, energyvalue) values($1, $2)", [data.text, data.energyvalue]);
            // SQL Query > Select Data
            var query = client.query("SELECT * FROM devices ORDER BY id ASC");

            // Stream results back one row at a time
            query.on('row', function(row) {
                results.push(row);
            });

            // After all data is returned, close connection and return results
            query.on('end', function() {
                done();
                return res.json(results);
            });
        })
        .fail(function(res){
             // SQL Query > Insert Data
            console.log('STATUS: ' + res.statuscode);
        });

    });
});

router.get('/api/v1/todos', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM devices ORDER BY id ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });

    });

});

router.put('/api/v1/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;

    // Grab data from http request
    var data = {text: req.body.text, energyvalue: req.body.energyvalue};

    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).send(json({ success: false, data: err}));
        }

        // SQL Query > Update Data
        client.query("UPDATE devices SET text=($1), energyvalue=($2) WHERE id=($3)", [data.text, data.energyvalue, id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM devices ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});

router.delete('/api/v1/todos/:todo_id', function(req, res) {

    var results = [];

    // Grab data from the URL parameters
    var id = req.params.todo_id;


    // Get a Postgres client from the connection pool
    pg.connect(connectionString, function(err, client, done) {
        // Handle connection errors
        if(err) {
          done();
          console.log(err);
          return res.status(500).json({ success: false, data: err});
        }

        // SQL Query > Delete Data
        client.query("DELETE FROM devices WHERE id=($1)", [id]);

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM devices ORDER BY id ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            done();
            return res.json(results);
        });
    });

});


module.exports = router;
