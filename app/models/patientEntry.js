import Sequelize, { Model } from 'sequelize';

class PatientEntry extends Model {
  get stayTimespanToText() {
    return this.stayTimespan
      ? `${Math.ceil(this.stayTimespan / (60 * 60 * 24))} Days`
      : '';
  }

  get patient() {
    // eslint-disable-next-line
    return this._modelOptions.sequelize.models.Patient.findOne({
      where: { id: this.patientId }
    });
  }

  get patientLocation() {
    // eslint-disable-next-line
    return this._modelOptions.sequelize.models.PatientLocation.findOne({
      where: { id: this.patientLocationId }
    });
  }

  get patientLocationName() {
    return this.patientLocation.then(l => l && l.name);
  }

  getRemotePatientId() {
    return this.patient.then(patient => patient && patient.remoteId);
  }

  getRemotePatientLocationId() {
    return this.patientLocation.then(location => location && location.remoteId);
  }
}

const model = sequelize => {
  const patientEntry = PatientEntry.init(
    {
      patientLocationId: { type: Sequelize.INTEGER },
      department: { type: Sequelize.STRING },
      stayTimespan: { type: Sequelize.INTEGER },
      admissionDate: { type: Sequelize.DATE },
      dischargeDate: { type: Sequelize.DATE },
      weight: { type: Sequelize.STRING },
      height: { type: Sequelize.STRING },
      pregnancyStatus: { type: Sequelize.STRING },
      prematureBirth: { type: Sequelize.STRING },
      chiefComplaint: { type: Sequelize.STRING },
      patientTransferred: { type: Sequelize.BOOLEAN },
      primaryDiagnosis: { type: Sequelize.STRING },
      primaryDiagnosisIcdCode: { type: Sequelize.STRING },
      acuteMyocardialInfarction: { type: Sequelize.BOOLEAN },
      chf: { type: Sequelize.BOOLEAN },
      notMentioned: { type: Sequelize.BOOLEAN },
      other: { type: Sequelize.BOOLEAN },
      antibioticsPrescribed: { type: Sequelize.BOOLEAN },
      antibiotic: { type: Sequelize.STRING },
      antibioticConsumption: { type: Sequelize.STRING },
      patientWasOnAnIndwellingMedicalDevice: { type: Sequelize.BOOLEAN },
      medicalDevice: { type: Sequelize.STRING },
      infectionAcquisition: { type: Sequelize.STRING },
      dischargeDiagnostic: { type: Sequelize.STRING },
      dischargeDiagnosticIcdCode: { type: Sequelize.STRING },
      patientOutcomeAtDischarge: { type: Sequelize.STRING },
      patientId: { type: Sequelize.INTEGER },
      remotePatientId: { type: Sequelize.INTEGER },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );
  patientEntry.addHook('beforeValidate', async instance => {
    if (instance.remotePatientId) {
      const patient = await sequelize.models.Patient.findOne({
        where: { remoteId: instance.remotePatientId }
      });
      // eslint-disable-next-line
      instance.patientId = patient.id;
    }

    if (instance.remotePatientLocationId) {
      const patientLocation = await sequelize.models.PatientLocation.findOne({
        where: { remoteId: instance.remotePatientLocationId }
      });
      // eslint-disable-next-line
      instance.patientLocationId = patientLocation.id;
    }
  });

  return patientEntry;
};

model.modelName = 'PatientEntry';

export default model;
