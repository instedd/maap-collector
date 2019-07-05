import Sequelize, { Model } from 'sequelize';

class CultureType extends Model {}

const model = sequelize =>
  CultureType.init(
    {
      name: { type: Sequelize.STRING },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'CultureType';

export default model;
