const generateRandomString = (length) => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const generateOrderNumber = () => {
  return `ORD-${Date.now().toString().slice(-6)}-${generateRandomString(4).toUpperCase()}`;
};

module.exports = {
  generateRandomString,
  generateOrderNumber,
};
