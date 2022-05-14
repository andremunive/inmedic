const BaseSerializer = require('./BaseSerializer');

class AuthSerializer extends BaseSerializer {
  constructor(accessToken,role) {
    super('success', { accessToken,role });
  }
}

module.exports = AuthSerializer;