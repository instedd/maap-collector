import Sequelize, { Model } from 'sequelize';

class PatientEntry extends Model {}

const model = sequelize =>
  PatientEntry.init(
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
      patientId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'PatientEntry';

export default model;
