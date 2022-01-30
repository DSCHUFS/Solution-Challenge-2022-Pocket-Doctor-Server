module.exports = {
    param(data, key) {
      if (Object.keys(data).length === 0) throw error(`파라미터 없음`);
      else {
        if (data[key] === undefined) {
          throw error(`해당 파라미터( ${key} )가 없습니다. 입력해주세요`);
        } else {
          return data[key];
        }
      }
    },
  };
  