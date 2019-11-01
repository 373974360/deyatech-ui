/* eslint-disable */
require('script-loader!file-saver');
require('script-loader!@/excel/Blob');
require('script-loader!xlsx/dist/xlsx.core.min');
function generateArray(table) {
  var out = [];
  var rows = table.querySelectorAll('tr');
  var ranges = [];
  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];
    var row = rows[R];
    var columns = row.querySelectorAll('td');
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C];
      var colspan = cell.getAttribute('colspan');
      var rowspan = cell.getAttribute('rowspan');
      var cellValue = cell.innerText;
      if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

      //Skip ranges
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({s: {r: R, c: outRow.length}, e: {r: R + rowspan - 1, c: outRow.length + colspan - 1}});
      }
      ;

      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null);

      //Handle Colspan
      if (colspan) for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
};

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
  var ws = {};
  var range = {s: {c: 10000000, r: 10000000}, e: {c: 0, r: 0}};
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      var cell = {v: data[R][C]};
      if (cell.v == null) continue;
      var cell_ref = XLSX.utils.encode_cell({c: C, r: R});

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = XLSX.SSF._table[14];
        cell.v = datenum(cell.v);
      }
      else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

export function export_table_to_excel(id) {
  var theTable = document.getElementById(id);
  console.log('a')
  var oo = generateArray(theTable);
  var ranges = oo[1];

  /* original data */
  var data = oo[0];
  var ws_name = "SheetJS";
  console.log(data);

  var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});

  saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), "test.xlsx")
}

function formatJson(jsonData) {
  console.log(jsonData)
}
export function export2Excel(th, jsonData, defaultTitle) {

  /* original data */

  var data = jsonData;
  data.unshift(th);
  var ws_name = "SheetJS";

  var wb = new Workbook(), ws = sheet_from_array_of_arrays(data);


  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
  var title = defaultTitle || '列表'
  saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), title + ".xlsx")
}


/****************************************修改源码，添加方法start****************************************/
export function exportDailyPriceSurveyData2Excel(jsonData, defaultTitle) {

    /* original data */
    var ws = sheet_from_array_of_arrays(jsonData);

    // 合并单元格
    mergeDailyCell(ws);

    /* add worksheet to workbook */
    writeExcel(ws, defaultTitle);
}

export function mergeDailyCell(ws) {
    // 合并单元格 - 表头
    ws["!merges"] = [
        {
            s: {    // s为开始
                c: 0,   // col
                r: 0    // row
            },
            e: {    // e为结束
                c: 6,
                r: 0
            }
        },
        {
            s: {
                c: 0,
                r: 1
            },
            e: {
                c: 6,
                r: 1
            }
        },
        {
            s: {
                c: 0,
                r: 2
            },
            e: {
                c: 0,
                r: 3
            }
        },
        {
            s: {
                c: 1,
                r: 2
            },
            e: {
                c: 1,
                r: 3
            }
        },
        {
            s: {
                c: 2,
                r: 2
            },
            e: {
                c: 3,
                r: 2
            }
        },
        {
            s: {
                c: 4,
                r: 2
            },
            e: {
                c: 5,
                r: 2
            }
        },
        {
            s: {
                c: 6,
                r: 2
            },
            e: {
                c: 6,
                r: 3
            }
        }
    ]

    mergeDataCell(ws, 5);
}

/**
 * 合并单元格 - 数据
 * @param ws excel对象
 * @param rowNumber 数据取值开始行数
 */
export function mergeDataCell(ws, rowStart) {
    let mergeObj = {};
    Object.keys(ws).forEach(key => {
        // 第rowNumber行取数据
        if (key.indexOf('A') != -1 && key.slice(1) >= rowStart) {
            if(mergeObj.hasOwnProperty(ws[key].v)){
                mergeObj[ws[key].v] += 1;
                ws[key].v = '';
            }else{
                Vue.set(mergeObj, ws[key].v, 0);
            }
        }
    })
    Object.keys(ws).forEach(key => {
        if (key.indexOf('A') != -1 && key.slice(1) >= rowStart) {
            if (mergeObj.hasOwnProperty(ws[key].v) && mergeObj[ws[key].v]) {
                let merge = {
                    s: {
                        c: 0,
                        r: key.slice(1) - 1
                    },
                    e: {
                        c: 0,
                        r: key.slice(1) - 1 + mergeObj[ws[key].v]
                    }
                }
                ws["!merges"].push(merge);
            }
        }
    })
}

/**
 * 输出Excel
 * @param ws excel对象
 * @param defaultTitle 输出Excel名称
 */
export function writeExcel(ws, defaultTitle) {
    var wb = new Workbook();
    var ws_name = "SheetJS";
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'binary'});
    var title = defaultTitle || '列表'
    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), title + ".xlsx")
}

export function exportTenDayPriceSurveyData2Excel(jsonData, defaultTitle) {

    /* original data */
    var ws = sheet_from_array_of_arrays(jsonData);

    // 合并单元格
    mergeTenDayCell(ws);

    /* add worksheet to workbook */
    writeExcel(ws, defaultTitle);
}

export function mergeTenDayCell(ws) {
    // 合并单元格 - 表头
    ws["!merges"] = [
        {
            s: {    // s为开始
                c: 0,   // col
                r: 0    // row
            },
            e: {    // e为结束
                c: 11,
                r: 0
            }
        },
        {
            s: {
                c: 0,
                r: 1
            },
            e: {
                c: 11,
                r: 1
            }
        },
        {
            s: {
                c: 0,
                r: 2
            },
            e: {
                c: 0,
                r: 3
            }
        },
        {
            s: {
                c: 1,
                r: 2
            },
            e: {
                c: 1,
                r: 3
            }
        },
        {
            s: {
                c: 2,
                r: 2
            },
            e: {
                c: 6,
                r: 2
            }
        },
        {
            s: {
                c: 7,
                r: 2
            },
            e: {
                c: 11,
                r: 2
            }
        }
    ]

    mergeDataCell(ws, 5);
}


export function exportWeeklyPriceSurveyData2Excel(jsonData, defaultTitle) {

    /* original data */
    var ws = sheet_from_array_of_arrays(jsonData);

    // 合并单元格
    mergeWeeklyCell(ws);

    /* add worksheet to workbook */
    writeExcel(ws, defaultTitle);
}

export function mergeWeeklyCell(ws) {
    // 合并单元格 - 表头
    ws["!merges"] = [
        {
            s: {    // s为开始
                c: 0,   // col
                r: 0    // row
            },
            e: {    // e为结束
                c: 5,
                r: 0
            }
        },
        {
            s: {
                c: 0,
                r: 1
            },
            e: {
                c: 5,
                r: 1
            }
        }
    ]

    mergeDataCell(ws, 4);
}
/****************************************修改源码，添加方法start****************************************/
