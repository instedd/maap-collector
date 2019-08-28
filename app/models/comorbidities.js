import changeCase from 'change-case';

export const all = [
  {
    value: 'acute_renal_failure',
    label: 'Acute Renal Failure'
  },
  {
    value: 'aids_hiv',
    label: 'AIDS/HIV'
  },
  {
    value: 'cancer',
    label: 'Cancer'
  },
  {
    value: 'cardiac_arrhythmia',
    label: 'Cardiac Arrhythmia'
  },
  {
    value: 'cerebrovascular_disease',
    label: 'Cerebrovascular Disease'
  },
  {
    value: 'chronic_lung_disease',
    label: 'Chronic Lung Disease'
  },
  {
    value: 'chronic_pulmonary_disease',
    label: 'Chronic Pulmonary Disease'
  },
  {
    value: 'chronic_renal_failure',
    label: 'Chronic Renal Failure'
  },
  {
    value: 'coagulation_deficiency',
    label: 'Coagulation deficiency'
  },
  {
    value: 'coagulopathy',
    label: 'Coagulopathy'
  },
  {
    value: 'congestive_heart_failure',
    label: 'Congestive Heart Failure'
  },
  {
    value: 'cvd',
    label: 'CVD'
  },
  {
    value: 'dementia',
    label: 'Dementia'
  },
  {
    value: 'depression',
    label: 'Depression'
  },
  {
    value: 'diabetes',
    label: 'Diabetes'
  },
  {
    value: 'dyslipidemia',
    label: 'Dyslipidemia'
  },
  {
    value: 'hemiplegia',
    label: 'Hemiplegia'
  },
  {
    value: 'hypertension',
    label: 'Hypertension'
  },
  {
    value: 'hypothyroidism',
    label: 'Hypothyroidism'
  },
  {
    value: 'liver_disease',
    label: 'Liver disease'
  },
  {
    value: 'lymphoma',
    label: 'Lymphoma'
  },
  {
    value: 'liver_disease',
    label: 'Liver disease'
  },
  {
    value: 'metastatic_cancer',
    label: 'Metastatic Cancer'
  },
  {
    value: 'obesity',
    label: 'Obesity'
  },
  {
    value: 'other_neurological_disorders',
    label: 'Other Neurological Disorders'
  },
  {
    value: 'paralysis',
    label: 'Paralysis'
  },
  {
    value: 'parapelgia',
    label: 'Parapelgia'
  },
  {
    value: 'peptic_ulcer_disease',
    label: 'Peptic ulcer disease'
  },
  {
    value: 'peripheral_vascular_disease',
    label: 'Peripheral Vascular Disease'
  },
  {
    value: 'psychosis',
    label: 'Psychosis'
  },
  {
    value: 'pulmonary_disease',
    label: 'Pulmonary Disease'
  },
  {
    value: 'renal_disease',
    label: 'Renal disease'
  },
  {
    value: 'rheumatologic_disease',
    label: 'Rheumatologic disease'
  }
];

export const fromValue = val => ({
  value: val,
  label: changeCase.sentenceCase(val)
});

export const comorbiditiesByValue = all.reduce(
  (accum, current) => ({
    ...accum,
    [current.value]: current
  }),
  {}
);

export const comorbiditiesFromValues = comorbidityValues =>
  comorbidityValues.map(val => comorbiditiesByValue[val] || fromValue(val));
