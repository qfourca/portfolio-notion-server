const fetch = require("node-fetch");

const s3 = require("./s3");

module.exports = async (key, fileUrl, options) => {
  const buffer = await (await fetch(fileUrl)).buffer();
  return await s3
    .putObject({
      Key: key,
      Body: buffer,
      ...options,
    })
    .promise();
};
