const dbConn = require("../config/db");

const model = {};

const SQL_ADDFILM = "INSERT INTO localfilm SET ?";
const SQL_FILMEXISTS = "SELECT id FROM localfilm WHERE id = ?"
const SQL_LISTFILMS = "SELECT * FROM localfilm ORDER BY local_date DESC";
const SQL_GETFILM = "SELECT * FROM localfilm WHERE id = ?";
const SQL_DELETEFILM = "DELETE FROM localfilm WHERE id = ?";

model.addFilm = objF => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_ADDFILM, [objF], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

model.checkIfFilmExists = filmid => {
    return new Promise((resolve, reject) => {
        dbConn.query(SQL_FILMEXISTS, [filmid], (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

model.getFilms = () => {
    return new Promise((resolve, reject) => {
        dbConn.query(SQL_LISTFILMS, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        })
    })
}

model.getFilm = (id) => {
  return new Promise((resolve, reject) => {
      dbConn.query(SQL_GETFILM, [id], (err, result) => {
          if (err) reject(err);
          else resolve(result);
      })
  })
}

model.deleteFilm = (id) => {
  return new Promise((resolve, reject) => {
    dbConn.query(SQL_DELETEFILM, [id], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    })
  })
}
module.exports = model;