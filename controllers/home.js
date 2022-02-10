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
              SELECT d.no as doctor_no, d.name as doctor_name, h.name as hospital_name, d.subject as doctor_subject, d.enabled as doctor_enabled
              FROM doctors as d, hospitals as h
              WHERE d.hospital_no = h.no
            `,
          );

          next({ result, message: "전체 의사 정보를 조회했습니다.", status: 200 });
        } catch (e) {
          next(e);
        }
      },
    
};

module.exports = controller;