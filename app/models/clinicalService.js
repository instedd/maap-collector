import Sequelize, { Model } from 'sequelize';

class ClinicalService extends Model {}

const model = sequelize =>
  ClinicalService.init(
    {
      name: { type: Sequelize.STRING },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'ClinicalService';

export default model;
