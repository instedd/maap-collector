export const all = [
  {
    value: 'prior_to_admission',
    label: 'Prior to admission'
  },
  {
    value: 'in_hospital',
    label: 'In hospital'
  },
  {
    value: 'not_mentioned',
    label: 'Not mentioned'
  }
];

export const byValue = value =>
  all.find(pt => pt.value === value) || { value, label: value };
