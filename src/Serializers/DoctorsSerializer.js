const BaseSerializer = require('./BaseSerializer');

class DoctorsSerializer extends BaseSerializer {
  constructor(models, paginationInfo) {
    const serializedModels = models.map((model) => {
      const serializedModel = model.toJSON();

      delete serializedModel?.password;
      delete serializedModel?.active;
      delete serializedModel?.role;
      delete serializedModel?.birthDate;
      delete serializedModel?.documentNumber;
      delete serializedModel?.gender;
      delete serializedModel?.lastLoginDate;
      delete serializedModel?.professionalCard;
      
      return serializedModel;
    });

    super('success', serializedModels, paginationInfo);
  }
}

module.exports = DoctorsSerializer;