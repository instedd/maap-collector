import Sequelize, { Model } from 'sequelize';

class Patient extends Model {}

const model = sequelize =>
  Patient.init(
    {
      patientId: {
        type: Sequelize.STRING,
        unique: {
          args: true,
          msg: 'Patient ID is already in use'
        },
        validate: {
          notEmpty: {
            args: true,
            msg: 'Patient ID should not be empty'
          }
        }
      },
      gender: { type: Sequelize.STRING },
      yearOfBirth: { type: Sequelize.INTEGER },
      levelOfEducation: { type: Sequelize.STRING },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER },
      siteId: {
        type: Sequelize.INTEGER,
        unique: {
          arg: true,
          msg: 'Patient ID is already in use'
        }
      }
    },
    {
      uniqueKeys: {
        actions_unique: {
          fields: ['siteId', 'patientId']
        }
      },
      sequelize,
      modelName: model.modelName
    }
  );

model.modelName = 'Patient';

export default model;
