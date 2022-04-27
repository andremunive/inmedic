const { verifyAccessToken} = require('../../helpers/jwt');
const ApiError = require('../../utils/ApiError');

function authDoctorMiddleware(req, res, next) {
  const accessToken = req.headers.authorization?.split(' ')[1];

  try {
    if (accessToken == null) {
      throw new ApiError('Access token required', 401);
    }

    const doctor = verifyAccessToken(accessToken);

    const isRole = (role) => {
      if (doctor.role !== role) {
        throw new ApiError('Role not authorized', 403);
      }
    };

    const isUserAuthorized = (userId) => {
      if (doctor._id !== userId) {
        throw new ApiError('User not authorized', 403);
      }
    };

    req.doctor = doctor;
    req.isRole = isRole;
    req.isUserAuthorized = isUserAuthorized;

    next();
  } catch ({ message, statusCode }) {
    next(new ApiError(message, statusCode || 400));
  }
}

module.exports = {
  authDoctorMiddleware,
};