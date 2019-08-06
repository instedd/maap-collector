import xlsx from 'xlsx';

class XlsxManager {
  constructor(path) {
    this.file = xlsx.readFile(path);
    const [currentSheetName] = this.file.SheetNames;
    this.currentSheetName = currentSheetName;
  }

  get currentSheet() {
    this.cachedCurrentSheet =
      this.cachedCurrentSheet || this.file.Sheets[this.currentSheetName];
    return this.cachedCurrentSheet;
  }

  get range() {
    this.cachedRange =
      this.cachedRange || xlsx.utils.decode_range(this.currentSheet['!ref']);
    return {
      end: {
        row: this.cachedRange.e.r,
        col: this.cachedRange.e.c
      },
      start: {
        row: this.cachedRange.s.r,
        col: this.cachedRange.s.c
      }
    };
  }

  rows(rowNumberFrom, rowNumberTo) {
    const rowAcc = [];
    for (let index = rowNumberFrom; index < rowNumberTo; index += 1) {
      rowAcc.push(this.row(index));
    }
    return rowAcc;
  }

  row(rowNumber) {
    const { end } = this.range;

    return [...new Array(end.col)].map(
      (col, index) =>
        this.currentSheet[
          xlsx.utils.encode_cell({ r: parseInt(rowNumber, 10), c: index })
        ] || { v: '', w: '', t: '', h: '', r: '' }
    );
  }
}

export default XlsxManager;
