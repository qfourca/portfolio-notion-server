const s3 = require("./s3");

module.exports = async (key) => {
  return await s3.getSignedUrlPromise("getObject", {
    Key: key,
    Expires: 3600,
  });
};
