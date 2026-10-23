const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host:'localhost',
    port:3306,
    user:'root',
    password:'@1@0z1z0!',
    database:'aft_70'
})

module.exports = db