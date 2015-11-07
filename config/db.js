// config/db.js

module.exports = {
    url : 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds049864.mongolab.com:49864/lettuce'
};