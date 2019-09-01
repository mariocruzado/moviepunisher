const dbConn = require("../config/db");

const model = {};

//DB Queries
//Check if user exists (for Sign up)
const SQL_ifUserExists = (user, email) =>
  `SELECT username, email FROM user WHERE username = "${user}" OR email = "${email}"`;

//Insert new user
const SQL_registerUser = () => `INSERT INTO user SET ?`;

//Find user by id
const SQL_findUserById = () =>
  `SELECT id, email, username, isadmin, regdate, profile_id, description, points FROM user WHERE id = ?`;

//Details of user
const SQL_detailUserById = () =>
  `SELECT user.id, user.email, user.username, user.isadmin, user.regdate, user.description, user.points, user.profile_id, profile.name AS profile_name, profile.avatar AS profile_avatar
  FROM user
  INNER JOIN profile ON profile.id = user.profile_id WHERE user.id = ?`;

//All users detailed
const SQL_detailAllUsers = () =>
  `SELECT user.id, user.username, user.isadmin, user.regdate, user.description, user.points, profile.name AS profile_name, profile.avatar AS profile_avatar, (SELECT COUNT(*) FROM review rev WHERE rev.user_id = user.id) AS reviews
  FROM user
  INNER JOIN profile ON profile.id = user.profile_id 
  ORDER BY reviews DESC`;

//Edit user info
const SQL_updateUser = () => `UPDATE user SET ? WHERE id = ?`;

//Delete User
const SQL_deleteUser = () => `DELETE FROM user WHERE id = ?`;

//Delete Reviews associated to user
const SQL_deleteReviews = () => `DELETE FROM review WHERE user_id = ?`;

//Delete Comments associated to user
const SQL_deleteComments = () => `DELETE FROM comment WHERE user_id = ?`;

//Delete rewards associated to user
const SQL_deleteRewards = () => `DELETE FROM reward WHERE user_id = ?`;

//Get profiles
const SQL_profiles = () => `SELECT * FROM profile`

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
    dbConn.query(SQL_registerUser(), [userObj], (err, result) => {
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

//Delete an user
model.deleteUser = id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_deleteUser(), [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//Delete reviews associated to user
model.deleteReviews = user_id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_deleteReviews(), [user_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

//Delete comments associated to user
model.deleteComments = user_id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_deleteComments(), [user_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//Delete rewards associated to user
model.deleteRewards = user_id => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_deleteRewards(), [user_id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

//Get profiles
model.getProfiles = () => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_profiles(), (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });  
}
module.exports = model;
