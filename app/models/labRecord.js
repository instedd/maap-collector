import Sequelize, { Model } from 'sequelize';

class LabRecord extends Model {}

const model = sequelize =>
  LabRecord.init(
    {
      fileName: { type: Sequelize.STRING },
      filePath: { type: Sequelize.STRING },
      headerRow: { type: Sequelize.INTEGER },
      dataRowsFrom: { type: Sequelize.INTEGER },
      dataRowsTo: { type: Sequelize.INTEGER },
      rows: { type: Sequelize.JSONB },
      columns: { type: Sequelize.JSONB },
      patientOrLabRecordId: { type: Sequelize.JSONB },
      phi: { type: Sequelize.JSONB },
      date: { type: Sequelize.JSONB },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'LabRecord';

export default model;
