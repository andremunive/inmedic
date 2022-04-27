const { verifyAccessToken} = require('../helpers/jwt');
const ApiError = require('../utils/ApiError');

function authMiddleware(req, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];

  try {
    if (accessToken == null) {
      throw new ApiError('Access token required', 401);
    }

    const client = verifyAccessToken(accessToken);
    const doctor = verifyAccessToken(accessToken);

    const isRole = (role) => {
      if (client.role || doctor.role !== role) {
        throw new ApiError('Role not authorized', 403);
      }
    };

    const isUserAuthorized = (userId) => {
      if (client._id || doctor._id !== userId) {
        throw new ApiError('User not authorized', 403);
      }
    };

    req.client = client;
    req.doctor = doctor;
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