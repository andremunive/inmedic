const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

// /**
//  *
//  * @param {Number} _id user._id
//  * @param {String} email user.role
//  * @returns {String}
//  */

function generateAccessToken(id, role) {
  return jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '1d' });
}

/**
 *
 * @param {String} token
 * @returns {{ _id: Number, role: String }}
 */
function verifyAccessToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

let invalidTokens = [];

function toInvalidTokensVerify(token) {
  return invalidTokens.includes(token);
}

function toInvalidTokens(token) {
  invalidTokens.push(token);
}

module.exports = {
  generateAccessToken,
  verifyAccessToken,
  toInvalidTokens,
  toInvalidTokensVerify
};

// var jwt = require('jwt-simple');
// var moment = require('moment');
// var secret = 'yisus99';

// exports.createToken = function(user){
//     var payload = {
//         sub: user._id,
//         nombres: user.nombres,
//         apellidos: user.apellidos,
//         email: user.email,
//         iat: moment().unix(),
//         exp: moment().add(1,'days').unix()
//     }

//     return jwt.encode(payload, secret);
// }