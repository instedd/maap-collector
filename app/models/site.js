import Sequelize, { Model } from 'sequelize';

class Site extends Model {}

const model = sequelize =>
  Site.init(
    {
      name: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
      location: { type: Sequelize.STRING },
      ownership: { type: Sequelize.STRING },
      hasPharmacy: { type: Sequelize.BOOLEAN },
      hasLaboratory: { type: Sequelize.BOOLEAN },
      hasHospital: { type: Sequelize.BOOLEAN },
      identifiedPatients: { type: Sequelize.BOOLEAN },
      permanentlyIdentifiedPatients: { type: Sequelize.BOOLEAN },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER },
      level: { type: Sequelize.STRING },
      teaching: { type: Sequelize.STRING }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'Site';

export default model;
