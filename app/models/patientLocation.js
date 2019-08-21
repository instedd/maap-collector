import Sequelize, { Model } from 'sequelize';

class PatientLocation extends Model {}

const model = sequelize =>
  PatientLocation.init(
    {
      name: { type: Sequelize.STRING },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'PatientLocation';

export default model;
