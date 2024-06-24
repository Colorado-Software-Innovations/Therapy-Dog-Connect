import React from 'react';
const Image = () => (
  <img
    src={'https://s3.amazonaws.com/therapydogconnect.com/assets/login-dog.jpg'}
    alt={'Long coated white dog PC: Caleb Woods'}
    loading="lazy"
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    }}
  />
);
export default Image;
