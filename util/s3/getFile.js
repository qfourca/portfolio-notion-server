const s3 = require("./s3");

module.exports = async (key) => {
  return await s3
    .getObject({
      Key: key,
    })
    .promise();
};
