import Sequelize, { Model } from 'sequelize';

class Patient extends Model {}

const model = sequelize =>
  Patient.init(
    {
      patientId: { type: Sequelize.STRING },
      gender: { type: Sequelize.STRING },
      yearOfBirth: { type: Sequelize.INTEGER },
      levelOfEducation: { type: Sequelize.STRING }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'Patient';

export default model;
