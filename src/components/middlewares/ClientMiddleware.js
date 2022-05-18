const { verifyAccessToken , toInvalidTokensVerify } = require('../../helpers/jwt');
const ApiError = require('../../utils/ApiError');

function authCLientMiddleware(req, res, next) {
  
  const accessToken = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';
  console.log("AYUDA 1 !!!!!!!", accessToken)
  //accessToken ====>>>>>> {
  //   id: '6268d2bc86b3d8a3213385d9',
  //   role: 'doctor',
  //   iat: 1651075204,
  //   exp: 1651161604
  // }
  try {

    if (accessToken == null) {
      throw new ApiError('Access token required', 401);
    }

    const client = verifyAccessToken(accessToken);
    console.log("AYUDA AAAA",client);
    if (client.role === 'user') {
        
    }else{
      throw new ApiError('Role not authorized', 403);
    }

    if (toInvalidTokensVerify(accessToken)){
      console.log("DANIEL 3")
      throw new ApiError('error', 401);
    };

    req.client = client;
    // req.isRole = isRole;
    // req.isUserAuthorized = isUserAuthorized;

    next();
  } catch ({ message, statusCode }) {
    next(new ApiError(message, statusCode || 400));
  }
}

module.exports = {
  authCLientMiddleware,
};