const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const crypto = require('crypto');

const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT || 'https://placeholder.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || 'placeholder',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || 'placeholder'
  }
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || 'placeholder';

const uploadToR2 = async (file, folder = '') => {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${folder}/${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype
  });

  await s3Client.send(command);
  return fileName;
};

const getSignedDownloadUrl = async (fileKey, fileName) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: fileKey,
    ResponseContentDisposition: `attachment; filename="${fileName}"`
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
  return url;
};

module.exports = {
  uploadToR2,
  getSignedDownloadUrl
};
