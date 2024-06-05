/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

console.log('AWS_PROJECT_REGION:', process.env.AWS_PROJECT_REGION);
console.log('AWS_COGNITO_IDENTITY_POOL_ID:', process.env.AWS_COGNITO_IDENTITY_POOL_ID);
console.log('AWS_COGNITO_REGION:', process.env.AWS_COGNITO_REGION);
console.log('AWS_USER_POOLS_ID:', process.env.AWS_USER_POOLS_ID);
console.log('AWS_USER_POOLS_WEB_CLIENT_ID:', process.env.AWS_USER_POOLS_WEB_CLIENT_ID);

const config = {
  aws_project_region: process.env.AWS_PROJECT_REGION,
  aws_cognito_identity_pool_id: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.AWS_COGNITO_REGION,
  aws_user_pools_id: process.env.AWS_USER_POOLS_ID,
  aws_user_pools_web_client_id: process.env.AWS_USER_POOLS_WEB_CLIENT_ID,
  oauth: {},
  aws_cognito_username_attributes: ['EMAIL'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['EMAIL'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
};

// Paths to the files
const jsonFilePath = path.join(__dirname, 'src', 'amplifyconfiguration.json');
const jsFilePath = path.join(__dirname, 'src', 'aws-exports.js');

// Write configuration to JSON file
fs.writeFileSync(jsonFilePath, JSON.stringify(config));
console.log(`Configuration has been written to ${jsonFilePath}`);

console.log('JSON ', JSON.stringify(config));

// Write configuration to JS file
const jsFileContent = `const awsExports = ${JSON.stringify(config, null, 2)};\nexport default awsExports;`;
fs.writeFileSync(jsFilePath, jsFileContent, 'utf-8');
console.log(`Configuration has been written to ${jsFilePath}`);
