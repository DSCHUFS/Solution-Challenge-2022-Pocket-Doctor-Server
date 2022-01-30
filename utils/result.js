const { httpStatus } = require('../config/httpStatusCode');

module.exports = {
  error(data) {
    const err = new Error();
    httpStatus.map((status) => {
      if (data === status.name) {
        err.code = status.code;
        err.message = status.defaultMessage;
        console.log("~~", data, err.message);
      }
    });
    err.code = err.code || 400;
    err.message = err.message || data;
    console.log(err.message);
    return err;
  },
};
