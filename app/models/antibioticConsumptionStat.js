import Sequelize, { Model } from 'sequelize';

class AntibioticConsumptionStat extends Model {}

const model = sequelize =>
  AntibioticConsumptionStat.init(
    {
      date: { type: Sequelize.DATE },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'AntibioticConsumptionStat';

export default model;
