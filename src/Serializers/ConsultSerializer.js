const BaseSerializer = require('./BaseSerializer');

class ConsultSerializer extends BaseSerializer {
  constructor(models, paginationInfo) {
    const serializedModels = models.map((model) => {
      const serializedModel = model.toJSON();

      delete serializedModel?._id;
      delete serializedModel?.idDoctor;
      delete serializedModel?.description2;
      delete serializedModel?.services;
      delete serializedModel?.tipoConsulta;
      delete serializedModel?.precio;
      
      return serializedModel;
    });

    super('success', serializedModels, paginationInfo);
  }
}

module.exports = ConsultSerializer;