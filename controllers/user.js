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
      
      async loginUser(req, res, next) {
        try {
          const body = req.body;
          const email = param(body, 'email');
          const password = param(body, 'password');
    
          const [results] = await pool.query(
            `
              SELECT * 
              FROM users 
              WHERE email = ?
              AND password = ?;
            `,
            [email, password]
          );
    
          if (results.length < 1) {
            throw error(`이메일 또는 비밀번호가 일치하지 않습니다.`);
          } else {
            const user_no = results[0].no;
            const email = results[0].email;
            const token = utils.sign({ user_no, email });
            next({ token });
          }
        } catch (e) {
          next(e);
        }
      },


      async getUser(req, res, next) {
        try {
          const user_no = req.user.user_no;
    
          const [result] = await pool.query(
            `
              SELECT no, email, name, phone_number
              FROM users
              WHERE no = ?
              AND enabled = 1 
            `,
            [user_no]
          );
    
          if (result.length < 1)
            throw error(`비활성화된 계정이거나 정보가 존재하지 않는 계정입니다.`);
    
          next({ ...result[0] });
        } catch (e) {
          next(e);
        }
      },


      async editUser(req, res, next) {
        try {
          const body = req.body;
          const user_no = req.user.user_no;
          const name = param(body, 'name');
          const password = param(body, 'password');
    
          const [result] = await pool.query(
            `
              SELECT * 
              FROM users
              WHERE no = ?
              AND enabled = 1;
            `,
            [user_no]
          );
    
          if (result.length < 1) throw error(`해당 학생이 존재하지 않습니다.`);
    
          const connection = await pool.getConnection(async (conn) => conn);
          try {
            await connection.beginTransaction();
            await connection.query(
              `
                UPDATE users
                SET
                name = ?,
                password = ?,
                WHERE no = ?
                AND enabled = 1;
              `,
              [name, password, user_no]
            );
    
            await connection.commit();
            next({ message: `계정 정보가 정상적으로 변경되었습니다.` });
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