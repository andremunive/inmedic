const BaseSerializer = require('./BaseSerializer');

class UserSerializer extends BaseSerializer {
  constructor(model) {
    const serializedModel = model ? model.toJSON() : null;

    delete serializedModel?.password;
    delete serializedModel?.active;
    delete serializedModel?.role;
    delete serializedModel?.birthDate;
    delete serializedModel?.documentNumber;
    delete serializedModel?.gender;
    delete serializedModel?.lastLoginDate;

    super('success', serializedModel);
  }
}

module.exports = UserSerializer;