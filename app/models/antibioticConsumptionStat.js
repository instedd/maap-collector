import Sequelize, { Model } from 'sequelize';

class AntibioticConsumptionStat extends Model {
  get issuedText() {
    return this.issued ? 'In' : 'Out';
  }
}

const model = sequelize => {
  const m = AntibioticConsumptionStat.init(
    {
      antibioticId: { type: Sequelize.INTEGER },
      remoteAntibioticId: { type: Sequelize.NUMBER },
      recipientFacility: { type: Sequelize.STRING },
      issued: { type: Sequelize.BOOLEAN },
      quantity: { type: Sequelize.NUMBER },
      balance: { type: Sequelize.NUMBER },
      recipientUnit: { type: Sequelize.STRING },
      date: { type: Sequelize.DATE },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );
  m.belongsTo(sequelize.models.Lab, {
    as: 'facility',
    foreignKey: 'facilityId'
  });
  // TODO: Abstract this to be generic and outside a hook
  m.addHook('beforeValidate', async instance => {
    // TODO: Get remote id's when only a local id is present
    if (instance.remoteAntibioticId) {
      const antibiotic = await sequelize.models.Antibiotic.findOne({
        where: { remoteId: instance.remoteAntibioticId }
      });
      // eslint-disable-next-line
      instance.antibioticId = antibiotic.id;
    }
  });
  return m;
};

model.modelName = 'AntibioticConsumptionStat';

export default model;
