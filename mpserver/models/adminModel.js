const dbConn = require('../config/db');
const model = {};

//DB Queries
//Check if user exists (for Sign up)
const SQL_ifUserExists = (user, email) =>
  `SELECT username, email FROM user WHERE username = "${user}" OR email = "${email}"`;

//Insert new user
const SQL_newUser = () => `INSERT INTO user SET ?`;

//Find user by id
const SQL_findUserById = () =>
  `SELECT id, email, username, isadmin, isbanned, regdate, profile_id, description, points FROM user WHERE id = ?`;

//Details of user
const SQL_detailUserById = () =>
  `SELECT user.id, user.email, user.username, user.isadmin, user.isbanned, user.regdate, user.description, user.points, user.profile_id, profile.name AS profile_name, profile.avatar AS profile_avatar
  FROM user
  INNER JOIN profile ON profile.id = user.profile_id WHERE user.id = ?`;

//All users detailed
const SQL_detailAllUsers = () =>
  `SELECT user.id, user.email, user.username, user.isadmin, user.isbanned, user.regdate, user.description, user.points, user.profile_id, profile.name AS profile_name, profile.avatar AS profile_avatar
  FROM user
  INNER JOIN profile ON profile.id = user.profile_id ORDER BY user.id ASC`;

//Edit user info
const SQL_updateUser = () => `UPDATE user SET ? WHERE id = ?`;

//Delete User
const SQL_deleteUser = () => `DELETE FROM user WHERE id = ?`;

//Check if user already exists
model.checkUser = userObj => {
  return new Promise((resolve, reject) => {
    dbConn.query(
      SQL_ifUserExists(userObj.username, userObj.email),
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

//Create new user
model.newUser = userObj => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_newUser(), [userObj], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//Get default user data
model.userById = id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_findUserById(), [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//Edit User
model.editUser = (id, userObj) => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_updateUser(), [userObj, id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//Get user detail
model.userDetailsById = id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_detailUserById(), [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//Retrieve detailed users list (with profile data)
model.getAll = () => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_detailAllUsers(), (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

module.exports = model;
