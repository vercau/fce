class XLSXHelper {

  static getReferences(workSheet) {
    let references = {};

    const split = workSheet["!refs"].split(":");
    const start = split[0];
    const end = split[1];

    const columnRegex = /^[A-Z]+/g;
    const rowRegex = /[0-9]+$/g;

    const startColumn = start.match(columnRegex)[0];
    const startRow = start.match(rowRegex)[0];

    const endColumn = end.match(columnRegex)[0];
    const endRow = end.match(rowRegex)[0];

    references = {
      start: {
        column: startColumn,
        row: startRow
      },
      end: {
        column: endColumn,
        row: endRow
      }
    };
    return references;
  }

  static getAlphabeticalColumnNames(workSheet){
    const refs = XLSXHelper.getReferences(workSheet);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    const startIndex = alphabet.indexOf(refs.start.column);
    const endIndex = alphabet.indexOf(refs.end.column);

    const columnNames = alphabet.slice(startIndex, endIndex + 1);
    return columnNames;
  }

}

module.exports = XLSXHelper;
