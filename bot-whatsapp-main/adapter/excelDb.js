const ExcelJS = require('exceljs');
const fs = require('fs');
const date = new Date().toLocaleString();
const saveMessageExcel = (message, trigger, number) => new Promise( async(resolve,reject) =>{
    try {
        const pathExcel = `${__dirname}/../chats/${number}.xlsx`;
        var workbook = new ExcelJS.Workbook();
        fs.access(pathExcel, fs.F_OK, (err) => {
            if (err) {
                console.error(err)
                const worksheet = workbook.addWorksheet("Libro1");
                worksheet.columns = [
                    {header: 'Fecha', key: 'Fecha', width: 25}, 
                    {header: 'Mensaje', key: 'Msj', width: 50},
                ];
                worksheet.addRow({Fecha: date, Msj: message});
                workbook.xlsx.writeFile(pathExcel);
                resolve('Saved')
            } else {
                workbook.xlsx.readFile(pathExcel).then(() => {
                    const worksheet = workbook.getWorksheet(1);
                    const lastRow = worksheet.lastRow;
                    var getRowInsert = worksheet.getRow(++(lastRow.number));
                    getRowInsert.getCell(1).value = date; 
                    getRowInsert.getCell(2).value = message; 
                    getRowInsert.commit();
                    return workbook.xlsx.writeFile(pathExcel);
                });
                resolve('Saved');
            }
        })
    } catch (error) {
        console.log(error)
        reject(error)
    }
})

module.exports = { saveMessageExcel }