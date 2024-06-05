/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const config = {
  aws_project_region: process.env.AWS_REGION,
  aws_cognito_identity_pool_id: process.env.AWS_COGNITO_IDENTITY_POOL_ID,
  aws_cognito_region: process.env.AWS_REGION,
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
console.log(JSON.stringify(config));
const configPath = path.join(__dirname, 'src', 'amplifyconfiguration.json');
fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
