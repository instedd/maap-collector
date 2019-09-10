module.exports = {
  up: (query, DataTypes) =>
    query.createTable('ElectronicPharmacyStockRecords', {
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
      phi: { type: DataTypes.JSONB },
      date: { type: DataTypes.JSONB },
      lastSyncAt: { type: DataTypes.DATE },
      remoteId: { type: DataTypes.INTEGER },
      siteId: { type: DataTypes.INTEGER }
    }),
  down: function down(query) {
    return query.dropTable('ElectronicPharmacyStockRecords');
  }
};
