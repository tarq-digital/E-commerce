const formatCurrency = (amount) => {
  return Number(parseFloat(amount).toFixed(2));
};

module.exports = { formatCurrency };
