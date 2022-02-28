const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const utils = require('../utils');
const { param } = require('../utils/params');
const { error } = require('../utils/result');

const controller = {

  async getReservation(req, res, next) {
    try {
      const user_no = req.user.user_no;
      const [result] = await pool.query(
        `
          SELECT r.no as reservation_no, u.name as user_name, d.name as doctor_name, h.name as hospital_name, r.start_datetime, r.description
          FROM reservations as r, users as u, doctors as d, hospitals as h
          WHERE u.no = ? and r.user_no = ? and r.doctor_no = d.no and r.hospital_no = h.no
        `,
        [user_no, user_no]
      );

      utils.formatting_datetime(result);
      next({ result, message: "전체 예약 정보를 조회했습니다.", status: 200 });
    } catch (e) {
      next(e);
    }
  },

  async createMedicine(req, res, next) {
    try {
      const body = req.body;
      const medicine_name = param(body, 'medicine_name');

      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        const [result] = await pool.query(
          `
            SELECT info as medicine_info
            FROM medicines
            WHERE name = ?
          `,
          [medicine_name]
        );
        await connection.commit();
      next({ ...result[0], message: `복약 정보를 생성했습니다.`, status: 200 });
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