const phoneFormatter = (phone) => {
  const cleaned = phone.replace(/[^\d+]/g, '');

  if (cleaned.startsWith('+1')) {
    return cleaned;
  } else if (cleaned.startsWith('+')) {
    return cleaned;
  } else if (cleaned.length <= 10) {
    return '+1' + cleaned;
  }

  return '+' + cleaned;
};

export default phoneFormatter;
