// hashPassword.js
const bcrypt = require('bcrypt');

function hashPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
}

const password = process.argv[2] || 'default_password';
const hashedPassword = hashPassword(password);
console.log('Hashed password:', hashedPassword);