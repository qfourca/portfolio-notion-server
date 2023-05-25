const aws = require("aws-sdk");

module.exports = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
  region: process.env.AWS_S3_BUCKET_REGION,
  params: {
    Bucket: process.env.AWS_S3_BUCKET,
  },
});
