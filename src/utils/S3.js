/* eslint-disable no-undef */
import AWS from 'aws-sdk';


AWS.config.update({
  accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
  region: process.env.REACT_APP_AWS_REGION,
});

const s3 = new AWS.S3();

export const uploadImageToS3 = async (file, path, bucketName) => {
  try {
    // Adjust S3 upload logic to use the `path` for the correct key
    const params = {
      Bucket: bucketName,
      Key: path, // Use the provided path
      Body: file,
      ContentType: file.type,
    };

    const result = await s3.upload(params).promise();
    return result.Location; // Return the uploaded file's URL
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

export const getImageFromS3 = (bucketName, objectKey) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: objectKey,
    };

    s3.getObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        // Convert binary data to base64
        const base64Image = `data:${data.ContentType};base64,${data.Body.toString('base64')}`;
        resolve(base64Image);
      }
    });
  });
};
