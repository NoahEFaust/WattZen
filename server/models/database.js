var pg = require('pg');
var path = require('path');
var connectionString = require(path.join(__dirname, '../', '../', 'config'));

var client = new pg.Client({
	user: 'admin',
	password: 'admin',
	database: 'wattzen',
	host: 'localhost',
	port: '5432'
});

var query = client.query('CREATE TABLE users(email VARCHAR(40) PRIMARY KEY, password VARCHAR(40) not null,phonenumber TEXT not null)');
query.on('end', function() { client.end(); });

var query = client.query('CREATE TABLE currentvalues(id SERIAL PRIMARY KEY, deviceid VARCHAR(40), timeread TIMESTAMP WITH TIME ZONE not null,rmscurrent double precision not null)');
query.on('end', function() { client.end(); });