const BaseSerializer = require('./BaseSerializer');

class AuthSerializer extends BaseSerializer {
    constructor(accessToken, role, userId, specialization) {
        super('success', { accessToken, role, userId, specialization });
    }
}

module.exports = AuthSerializer;