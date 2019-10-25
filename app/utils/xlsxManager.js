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

  get maxRow() {
    return this.range.end.row;
  }

  encodeCol = colNumber => xlsx.utils.encode_col(colNumber);

  rows(rowNumberFrom, rowNumberTo) {
    const rowAcc = [];
    for (let index = rowNumberFrom; index < rowNumberTo; index += 1) {
      rowAcc.push(this.row(index));
    }
    return rowAcc;
  }

  getCell(encodedCel) {
    const cell = {
      ...this.currentSheet[encodedCel]
    };
    if (cell.w) return cell;
    cell.w = this.currentSheet[encodedCel] && this.currentSheet[encodedCel].v;
    return cell;
  }

  row(rowNumber) {
    const { end } = this.range;
    return [...new Array(end.col + 1)].map((col, index) => ({
      ...(this.getCell(
        xlsx.utils.encode_cell({ r: parseInt(rowNumber, 10), c: index })
      ) || { v: '', w: '', t: '', h: '', r: '' }),
      c: this.encodeCol(index)
    }));
  }
}

export default XlsxManager;
