import Sequelize, { Model } from 'sequelize';

class SpecimenSource extends Model {}

const model = sequelize =>
  SpecimenSource.init(
    {
      name: { type: Sequelize.STRING },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'SpecimenSource';

export default model;
