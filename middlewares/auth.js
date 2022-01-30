const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const auth = require('../utils')

module.exports = {
    async checkToken(req, res, next) {
        const bearer_token = req.headers.authorization;
        const array = bearer_token.split(' ')
        const token = array[1]

        try {
            if (token === undefined) throw Error('Undefined Token')
            const verified = auth.verify(token)
            const user_no = verified.no

            const email = verified.email
            const [results] = await pool.query(`
            SELECT
            COUNT(*) AS 'count'
            FROM users
            WHERE enabled = 1
            AND no = ?;
            `, [user_no])

            if (results[0].count === 0) throw Error('Unauthorized Error')
            req.user = { user_no, email }
            next()
        }
        catch (e) {
            next(e)
        }
    },
}