const BaseSerializer = require('./BaseSerializer');

class AuthSerializer extends BaseSerializer {
  constructor(accessToken,role,userId) {
    super('success', { accessToken,role,userId });
  }
}

module.exports = AuthSerializer;