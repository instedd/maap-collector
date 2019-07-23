import Sequelize, { Model } from 'sequelize';

class PatientEntry extends Model {}

const model = sequelize =>
  PatientEntry.init(
    {
      chiefComplaint: { type: Sequelize.STRING },
      patientId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'PatientEntry';

export default model;
