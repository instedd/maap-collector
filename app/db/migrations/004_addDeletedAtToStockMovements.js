/* eslint-disable func-names */
/* eslint-disable object-shorthand */
module.exports = {
  up: function(query, DataTypes) {
    return Promise.all([
      query.addColumn('AntibioticConsumptionStats', 'deletedAt', {
        type: DataTypes.DATE
      })
    ]);
  },
  down: function down() {}
};
