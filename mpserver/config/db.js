const mysql = require('mysql');

//Create connection with mysql module
const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'mpclient',
    password: 'mpclientpass',
    database: 'moviepunisher'
});

dbConn.connect(err => {
    if (err) throw err;
});

module.exports = dbConn;
