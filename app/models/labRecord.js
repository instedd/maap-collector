import Sequelize, { Model } from 'sequelize';

class LabRecord extends Model {}

const model = sequelize =>
  LabRecord.init(
    {
      fileName: { type: Sequelize.STRING },
      filePath: { type: Sequelize.STRING }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'LabRecord';

export default model;
