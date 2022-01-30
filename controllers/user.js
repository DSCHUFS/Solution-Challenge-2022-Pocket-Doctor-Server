const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const utils = require('../utils');
const { param } = require('../utils/params');
const { error } = require('../utils/result');

const controller = {
    async ping(req, res, next) {
      next({
        success: 1,
        message: 'user',
      });
    },

    async createUser(req, res, next) {
        try {
          const body = req.body;
          const email = param(body, 'email');
          const password = param(body, 'password');
          const name = param(body, 'name');
          const phone_number = param(body, 'phone_number');
    
          const connection = await pool.getConnection(async (conn) => conn);
          try {
            await connection.beginTransaction();
            await connection.query(
              `
                INSERT INTO
                users(email, password, name, phone_number)
                VALUE
                (?, ?, ?, ?);
              `,
              [email, password, name, phone_number]
            );
            await connection.commit();
          next({ message: `회원가입이 완료되었습니다.` });
          } catch (e) {
            await connection.rollback();
          } finally {
            connection.release();
          }
        } catch (e) {
          next(e);
        }
      },
      
};

module.exports = controller;