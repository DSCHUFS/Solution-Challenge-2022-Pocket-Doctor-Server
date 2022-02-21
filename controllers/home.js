const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const utils = require('../utils');
const { param } = require('../utils/params');
const { error } = require('../utils/result');

const controller = {

  async getDoctor(req, res, next) {
    try {
      const [result] = await pool.query(
        `
          SELECT d.no as doctor_no, d.name as doctor_name, h.name as hospital_name, d.subject as doctor_subject, if(d.enabled, 'true', 'false') as doctor_enabled
          FROM doctors as d, hospitals as h
          WHERE d.hospital_no = h.no
        `,
      );

      next({ result, message: "전체 의사 정보를 조회했습니다.", status: 200 });
    } catch (e) {
      next(e);
    }
  },

  async getHospital(req, res, next) {
    try {
      const doctor_no = req.query.doctor_no;

      const [result] = await pool.query(
        `
          SELECT h.no as hospital_no, h.homepage as hospital_hompage, h.time as hospital_time, h.location as hospital_location
          FROM hospitals as h, doctors as d
          WHERE d.no = ? and h.no = d.hospital_no
        `,
        [doctor_no]
      );

      next({ ...result[0], message: "병원 정보를 조회했습니다.", status: 200 });
    } catch (e) {
      next(e);
    }
  },

  async createReservation(req, res, next) {
    try {
      const user_no = req.user.user_no;
      const body = req.body;
      const hospital_no = param(body, 'hospital_no');
      const doctor_no = param(body, 'doctor_no');
      const start_datetime = param(body, 'start_datetime');
      const description = param(body, 'description');
      const is_video = param(body, 'is_video');

      const connection = await pool.getConnection(async (conn) => conn);
      try {
        await connection.beginTransaction();
        await connection.query(
          `
            INSERT INTO
            reservations(user_no, hospital_no, doctor_no, description, start_datetime, is_video)
            VALUE
            (?, ?, ?, ?, ?, ?);
          `,
          [user_no, hospital_no, doctor_no, description, start_datetime, is_video]
        );
        await connection.commit();
      next({ message: `예약이 완료되었습니다.`, status: 200 });
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