const JWT = require('jsonwebtoken');
const dayjs = require('dayjs');
const config = require('../config');

module.exports = {
  sign(user) {
    const payload = {
      user_no: user.user_no,
      email: user.email,
    };
    const token = JWT.sign(payload, config.jwt.secretKey, config.jwt.options);
    return token;
  },
  verify(token) {
    let decoded;
    try {
      decoded = JWT.verify(token, config.jwt.secretKey);
    } catch (err) {
      if (err.message === 'jwt expired') {
        console.log('expired token');
        return null;
      } else {
        console.log('invalid token');
        return null;
      }
    }
    return decoded;
  },
  formatting_datetime(results) {
    results.map((result) => {
      result.start_datetime = dayjs(result.start_datetime).format(
        'YYYY-MM-DD HH:mm:00'
      );

      /*
      result.end_datetime = dayjs(result.end_datetime).format(
        'YYYY-MM-DDTHH:mm'
      );
      result.create_datetime = dayjs(result.create_datetime).format(
        'YYYY년 MM월 DD일 HH시 mm분 ss초'
      );
      result.update_datetime =
        result.update_datetime === null
          ? null
          : dayjs(result.update_datetime).format(
              'YYYY년 MM월 DD일 HH시 mm분 ss초'
            );
      result.delete_datetime =
        result.delete_datetime === null
          ? null
          : dayjs(result.delete_datetime).format(
              'YYYY년 MM월 DD일 HH시 mm분 ss초'
            )*/;
    });
    
    return results;
  },
};
