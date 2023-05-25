const aws = require("aws-sdk");
const https = require("https");
const fs = require("fs");
const fetch = require("node-fetch");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: process.env.AWS_S3_BUCKET_REGION,
  params: {
    Bucket: process.env.AWS_S3_BUCKET,
  },
});
exports.upload = (key, fileUrl, options) => {
  return new Promise((resolve, reject) => {
    fetch(fileUrl).then((response) => {
      response.buffer().then((buffer) => {
        s3.putObject(
          {
            Key: key,
            Body: buffer,
            ...options,
          },
          (err, x) => {
            if (err) {
              reject(err);
            } else {
              resolve(x);
            }
          }
        );
      });
    });
  });
};
