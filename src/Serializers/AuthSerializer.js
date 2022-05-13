const BaseSerializer = require('./BaseSerializer');

class AuthSerializer extends BaseSerializer {
  constructor(accessToken) {
    super('success', { accessToken });
  }
}

module.exports = AuthSerializer;