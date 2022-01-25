import XLSX from 'xlsx'

export default function importXlsx(input) {
    const reader = new FileReader()
    let newList = []
    // parse binary to json using SheetJS
    reader.onload = function () {
        try {
            // convert the whole binary string to workbook object
            const wb = XLSX.read(reader.result, {
                type: 'binary'
            })
            let data = [] // data storage
            // traverse sheets
            for (let sheet in wb.Sheets) {
                if (wb.Sheets.hasOwnProperty(sheet)) {
                    data = data.concat(XLSX.utils.sheet_to_json(wb.Sheets[sheet]))
                    break // only get the first spreadsheet
                }
            }
            this.newList = data
        } catch (e) {
            alert('文件类型错误!')
            return
        }
    }
    // user FileReader to fetch xlsx's binary
    reader.readAsBinaryString(input.files[0])
    console.log(newList)
    return newList
}
