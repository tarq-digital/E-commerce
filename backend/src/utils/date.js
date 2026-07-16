const getUTCTime = () => new Date().toISOString();

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString();
};

const isExpired = (expiryDate) => {
  return new Date() > new Date(expiryDate);
};

module.exports = {
  getUTCTime,
  addDays,
  isExpired,
};
