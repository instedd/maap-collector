import Sequelize, { Model } from 'sequelize';

class Antibiotic extends Model {
  get strength() {
    if (!this.strengthValue) return;
    if (!this.strengthUnit) return this.strengthValue;
    return `${this.strengthValue}${this.strengthUnit}`;
  }
}

const model = sequelize =>
  Antibiotic.init(
    {
      name: { type: Sequelize.STRING },
      strengthValue: { type: Sequelize.STRING },
      strengthUnit: { type: Sequelize.STRING },
      form: { type: Sequelize.STRING },
      packSize: { type: Sequelize.STRING },
      brand: { type: Sequelize.STRING },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'Antibiotic';

export default model;
