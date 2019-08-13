import Sequelize, { Model } from 'sequelize';

class PatientEntry extends Model {
  get patient() {
    // eslint-disable-next-line
    return this._modelOptions.sequelize.models.Patient.findOne({
      where: { id: this.patientId }
    });
  }

  getRemotePatientId() {
    return this.patient.then(patient => patient && patient.remoteId);
  }
}

const model = sequelize => {
  const patientEntry = PatientEntry.init(
    {
      location: { type: Sequelize.STRING },
      department: { type: Sequelize.STRING },
      admissionDate: { type: Sequelize.DATE },
      dischargeDate: { type: Sequelize.DATE },
      weight: { type: Sequelize.STRING },
      height: { type: Sequelize.STRING },
      pregnancyStatus: { type: Sequelize.BOOLEAN },
      prematureBirth: { type: Sequelize.BOOLEAN },
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
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );
  patientEntry.addHook('beforeValidate', async instance => {
    // TODO: Get remote id's when only a local id is present
    if (instance.remotePatientId) {
      const patient = await sequelize.models.Patient.findOne({
        where: { remoteId: instance.remotePatientId }
      });
      // eslint-disable-next-line
      instance.patientId = patient.id;
    }
  });

  return patientEntry;
};

model.modelName = 'PatientEntry';

export default model;
