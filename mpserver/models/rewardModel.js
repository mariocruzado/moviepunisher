const dbConn = require('../config/db');

const model = {};

//Get prizes by user
const SQL_prizesByUser = () => 
`SELECT user.username AS user_username, user.points AS user_points, reward.user_id AS user_id, reward.prize, reward.date, reward.id FROM reward
INNER JOIN user ON user.id = reward.user_id
WHERE reward.user_id = ?`

model.getPrizes = (user_id) => {
return new Promise((resolver, reject) => {
    dbConn.query(SQL_prizesByUser(), user_id, (err, result) => {
        if (err) reject(err);
        else resolver(result);
    })
});
}

module.exports = model;