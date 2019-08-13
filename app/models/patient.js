import Sequelize, { Model } from 'sequelize';

class Patient extends Model {
  get availablePatientId() {
    return this.patientId || this.remotePatientId;
  }

  get site() {
    // eslint-disable-next-line
    return this._modelOptions.sequelize.models.Site.findOne({
      where: { id: this.siteId }
    });
  }

  getRemoteSiteId() {
    return this.site.then(site => site && site.remoteId);
  }
}

const model = sequelize => {
  const patient = Patient.init(
    {
      remotePatientId: { type: Sequelize.STRING },
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

  // TODO: Abstract this to be generic and outside a hook
  patient.addHook('beforeValidate', async instance => {
    // TODO: Get remote id's when only a local id is present
    if (instance.remoteSiteId) {
      console.log('hook');
      const site = await sequelize.models.Site.findOne({
        where: { remoteId: instance.remoteSiteId }
      });
      // eslint-disable-next-line
      instance.siteId = site.id;
    }
  });
  return patient;
};

model.modelName = 'Patient';

export default model;
