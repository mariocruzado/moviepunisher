const dbConn = require("../config/db");

const model = {};

const SQL_authUser = (pass) =>
  `SELECT id, username, isadmin, isbanned FROM user WHERE username = ? AND password = SHA1("${pass}")`;

model.authUser = (username, pass) => {
  return new Promise((resolve, reject) => {
    dbConn.query(
        SQL_authUser(pass), [username], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        }
    );
  });
};

module.exports = model;