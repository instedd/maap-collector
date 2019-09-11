/* eslint-disable func-names */
/* eslint-disable object-shorthand */
module.exports = {
  up: function(query, DataTypes) {
    return Promise.all([
      query.addColumn('ElectronicPharmacyStockRecords', 'createdAt', {
        type: DataTypes.DATE
      }),
      query.addColumn('ElectronicPharmacyStockRecords', 'updatedAt', {
        type: DataTypes.DATE
      })
    ]);
  },
  down: function down() {}
};
