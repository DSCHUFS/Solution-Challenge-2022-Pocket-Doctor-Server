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
    });
    
    return results;
  },
};
