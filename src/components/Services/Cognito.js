/* eslint-disable no-undef */
import AWS from 'aws-sdk';

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-1',
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
});

const createUser = async (params) => {
  if (!params) return;
  return await cognito.adminCreateUser(params).promise();
};

export default createUser;
