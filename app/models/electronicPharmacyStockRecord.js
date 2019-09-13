import Sequelize, { Model } from 'sequelize';

class ElectronicPharmacyStockRecord extends Model {
  get site() {
    // eslint-disable-next-line
    return this._modelOptions.sequelize.models.Site.findOne({
      where: { id: this.siteId }
    });
  }

  getRemoteSiteId() {
    return this.site.then(site => site && site.remoteId);
  }
}

const model = sequelize =>
  ElectronicPharmacyStockRecord.init(
    {
      fileName: { type: Sequelize.STRING },
      filePath: { type: Sequelize.STRING },
      headerRow: { type: Sequelize.INTEGER },
      dataRowsFrom: { type: Sequelize.INTEGER },
      dataRowsTo: { type: Sequelize.INTEGER },
      rows: { type: Sequelize.JSONB },
      columns: { type: Sequelize.JSONB },
      phi: { type: Sequelize.JSONB },
      date: { type: Sequelize.JSONB },
      lastSyncAt: { type: Sequelize.DATE },
      remoteId: { type: Sequelize.INTEGER },
      siteId: { type: Sequelize.INTEGER }
    },
    { sequelize, modelName: model.modelName }
  );

model.modelName = 'ElectronicPharmacyStockRecord';

export default model;
