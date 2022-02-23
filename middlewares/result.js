const { error } = require('../utils');

const json = {
  async result(data, req, res, next) {
    console.log(data);
    if (data instanceof Error) {
      if (!Number.isInteger(data.code)) next(data);
      res.status(data.code).json({ message: data.message, status: data.code });
    } else {
      res.status(200).json({ ...data });
    }
  },
  async internalServerError(data, req, res, next) {
    if (!data) next(error(`internalServerError`));
    else {
      res.status(500).json({ message: data.message, status: data.code });
    }
  },
};

module.exports = { json };
