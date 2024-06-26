const validateEmail = (email) => {
  // Basic email regex for validation
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export default validateEmail;
