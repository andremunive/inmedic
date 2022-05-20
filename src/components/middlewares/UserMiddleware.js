const { verifyAccessToken, toInvalidTokensVerify } = require('../../helpers/jwt');
const ApiError = require('../../utils/ApiError');

function authMiddleware(req, res, next) {
  const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

  try {
    if (accessToken == null) {
      console.log("DANIEL 1")
      throw new ApiError('Access token required', 401);
    }

    const user = verifyAccessToken(accessToken);
    console.log('RES', user);
    console.log('USER1: ', user.id);
    const isRole = (role) => {
      if (user.role !== role) {
        console.log("DANIEL 2")
        throw new ApiError('Role not authorized', 403);
      }
    };
    const isUserAuthorized = (userId) => {
        console.log('USER2',userId);
      if (user.id !== userId) {
        throw new ApiError('User not authorized', 403);
      }
    };

    if (toInvalidTokensVerify(accessToken)){
      console.log("DANIEL 3")
      throw new ApiError('error', 401);
    };

    req.user = user;
    req.isRole = isRole;
    req.isUserAuthorized = isUserAuthorized;

    next();
  } catch ({ message, statusCode }) {
    next(new ApiError(message, statusCode || 400));
  }
}

module.exports = {
  authMiddleware,
};
