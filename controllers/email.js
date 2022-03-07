const mysql = require('mysql2/promise');
const dbconfig = require('../config/index').mysql;
const pool = mysql.createPool(dbconfig);
const { param } = require('../utils/params');
const { error } = require('../utils/result');

const { transporter } = require('../config/email');
const ejs = require('ejs');
const path = require('path');
let appDir = path.dirname(require.main.filename);

const controller = {
  async sendEmail(req, res, next) {
    try {
      const body = req.body;
      const email = param(body, 'email');

      const [result] = await pool.query(
        `
        SELECT
        COUNT(*) AS 'count'
        FROM users
        WHERE enabled=1
        AND email = ?
        `,
        [email]
      );

      if (result[0].count > 0) throw error(`이미 존재하는 계정입니다.`);

      const auth_num = Math.random().toString().substr(2, 6);
      let emailTemplete;
      ejs.renderFile(
        appDir + '/template/email.ejs',
        { authCode: auth_num },
        function (e, data) {
          if (e) {
            next(e);
          }
          emailTemplete = data;
        }
      );

      const mailOptions = {
        from: `Pocket Doctor`,
        to: req.body.email,
        subject: `[Pocket Doctor] 회원가입을 위한 인증번호입니다.`,
        html: emailTemplete,
      };

      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          next(error);
        }
        res.status(200).json({ auth_num, email: email, message: "이메일을 전송했습니다.", status: 200 });
        transporter.close();
      });
    } catch (e) {
      next(e);
    }
  },
};

module.exports = controller;
