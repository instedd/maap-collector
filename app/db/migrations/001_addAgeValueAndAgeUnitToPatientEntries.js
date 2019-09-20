/* eslint-disable func-names */
/* eslint-disable object-shorthand */
module.exports = {
  up: function(query, DataTypes) {
    return Promise.all([
      query.addColumn('PatientEntries', 'ageValue', {
        type: DataTypes.INTEGER
      }),
      query.addColumn('PatientEntries', 'ageUnit', { type: DataTypes.STRING })
    ]);
  },
  down: function down() {}
};
