/* eslint-disable func-names */
/* eslint-disable object-shorthand */
module.exports = {
  up: function(query, DataTypes) {
    return createAntibioticTable(query, DataTypes)
      .then(createAntibioticConsumptionStatTable(query, DataTypes))
      .then(createClinicalServiceTable(query, DataTypes))
      .then(createCultureTypeTable(query, DataTypes))
      .then(createLabRecordTable(query, DataTypes))
      .then(createPatientTable(query, DataTypes))
      .then(createPatientEntryTable(query, DataTypes))
      .then(createPatientLocationTable(query, DataTypes))
      .then(createSiteTable(query, DataTypes))
      .then(createSpecimenSourceTable(query, DataTypes));
  },
  down: function down(query) {
    return query
      .dropTable('SpecimenSources')
      .then(() => query.dropTable('Sites'))
      .then(() => query.dropTable('PatientLocations'))
      .then(() => query.dropTable('PatientEntries'))
      .then(() => query.dropTable('Patients'))
      .then(() => query.dropTable('LabRecords'))
      .then(() => query.dropTable('CultureTypes'))
      .then(() => query.dropTable('ClinicalServices'))
      .then(() => query.dropTable('AntibioticConsumptionStats'))
      .then(() => query.dropTable('Antibiotics'));
  }
};

const createAntibioticTable = (query, DataTypes) =>
  query.createTable('Antibiotics', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING },
    strengthValue: { type: DataTypes.STRING },
    strengthUnit: { type: DataTypes.STRING },
    form: { type: DataTypes.STRING },
    packSize: { type: DataTypes.STRING },
    brand: { type: DataTypes.STRING },
    lastSyncAt: { type: DataTypes.DATE },
    remoteId: { type: DataTypes.INTEGER },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const createAntibioticConsumptionStatTable = (query, DataTypes) => () =>
  query.createTable('AntibioticConsumptionStats', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    antibioticId: { type: DataTypes.INTEGER },
    remoteAntibioticId: { type: DataTypes.NUMBER },
    recipientFacility: { type: DataTypes.STRING },
    issued: { type: DataTypes.BOOLEAN },
    quantity: { type: DataTypes.NUMBER },
    balance: { type: DataTypes.NUMBER },
    recipientUnit: { type: DataTypes.STRING },
    date: { type: DataTypes.DATE },
    lastSyncAt: { type: DataTypes.DATE(6) },
    remoteId: { type: DataTypes.INTEGER },
    remoteSiteId: { type: DataTypes.INTEGER },
    siteId: { type: DataTypes.INTEGER },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const createClinicalServiceTable = (query, DataTypes) => () =>
  query.createTable('ClinicalServices', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING },
    lastSyncAt: { type: DataTypes.DATE },
    remoteId: { type: DataTypes.INTEGER },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const createCultureTypeTable = (query, DataTypes) => () =>
  query.createTable('CultureTypes', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING },
    lastSyncAt: { type: DataTypes.DATE },
    remoteId: { type: DataTypes.INTEGER },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const createLabRecordTable = (query, DataTypes) => () =>
  query.createTable('LabRecords', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    fileName: { type: DataTypes.STRING },
    filePath: { type: DataTypes.STRING },
    headerRow: { type: DataTypes.INTEGER },
    dataRowsFrom: { type: DataTypes.INTEGER },
    dataRowsTo: { type: DataTypes.INTEGER },
    rows: { type: DataTypes.JSONB },
    columns: { type: DataTypes.JSONB },
    patientOrLabRecordId: { type: DataTypes.JSONB },
    phi: { type: DataTypes.JSONB },
    date: { type: DataTypes.JSONB },
    lastSyncAt: { type: DataTypes.DATE },
    remoteId: { type: DataTypes.INTEGER },
    siteId: { type: DataTypes.INTEGER },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const createPatientTable = (query, DataTypes) => () =>
  query.createTable('Patients', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    remotePatientId: { type: DataTypes.STRING },
    patientId: {
      type: DataTypes.STRING,
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
    gender: { type: DataTypes.STRING },
    yearOfBirth: { type: DataTypes.INTEGER },
    levelOfEducation: { type: DataTypes.STRING },
    lastSyncAt: { type: DataTypes.DATE },
    remoteId: { type: DataTypes.INTEGER },
    remoteSiteId: { type: DataTypes.INTEGER },
    siteId: {
      type: DataTypes.INTEGER,
      unique: {
        arg: true,
        msg: 'Patient ID is already in use'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const createPatientEntryTable = (query, DataTypes) => () =>
  query.createTable('PatientEntries', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    patientLocationId: { type: DataTypes.INTEGER },
    department: { type: DataTypes.STRING },
    stayTimespan: { type: DataTypes.INTEGER },
    admissionDate: { type: DataTypes.DATE },
    dischargeDate: { type: DataTypes.DATE },
    weight: { type: DataTypes.STRING },
    height: { type: DataTypes.STRING },
    pregnancyStatus: { type: DataTypes.STRING },
    prematureBirth: { type: DataTypes.STRING },
    chiefComplaint: { type: DataTypes.STRING },
    patientTransferred: { type: DataTypes.BOOLEAN },
    primaryDiagnosis: { type: DataTypes.STRING },
    primaryDiagnosisIcdCode: { type: DataTypes.STRING },
    antibioticsPrescribed: { type: DataTypes.BOOLEAN },
    prescribedAntibioticsList: { type: DataTypes.STRING },
    patientWasOnAnIndwellingMedicalDevice: { type: DataTypes.BOOLEAN },
    medicalDevice: { type: DataTypes.STRING },
    infectionAcquisition: { type: DataTypes.STRING },
    dischargeDiagnostic: { type: DataTypes.STRING },
    dischargeDiagnosticIcdCode: { type: DataTypes.STRING },
    patientOutcomeAtDischarge: { type: DataTypes.STRING },
    patientId: { type: DataTypes.INTEGER },
    remotePatientId: { type: DataTypes.INTEGER },
    lastSyncAt: { type: DataTypes.DATE },
    remoteId: { type: DataTypes.INTEGER },
    comorbidities: { type: DataTypes.STRING },
    antibioticWhen: { type: DataTypes.STRING },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const createPatientLocationTable = (query, DataTypes) => () =>
  query.createTable('PatientLocations', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING },
    lastSyncAt: { type: DataTypes.DATE },
    remoteId: { type: DataTypes.INTEGER },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const createSiteTable = (query, DataTypes) => () =>
  query.createTable('Sites', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    ownership: { type: DataTypes.STRING },
    hasPharmacy: { type: DataTypes.BOOLEAN },
    hasLaboratory: { type: DataTypes.BOOLEAN },
    hasHospital: { type: DataTypes.BOOLEAN },
    identifiedPatients: { type: DataTypes.BOOLEAN },
    permanentlyIdentifiedPatients: { type: DataTypes.BOOLEAN },
    lastSyncAt: { type: DataTypes.DATE },
    remoteId: { type: DataTypes.INTEGER },
    level: { type: DataTypes.STRING },
    teaching: { type: DataTypes.STRING },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

const createSpecimenSourceTable = (query, DataTypes) => () =>
  query.createTable('SpecimenSources', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: { type: DataTypes.STRING },
    lastSyncAt: { type: DataTypes.DATE },
    remoteId: { type: DataTypes.INTEGER },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });
