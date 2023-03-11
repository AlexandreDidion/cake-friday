import{ read, utils } from "xlsx"

export interface FromExcelMember {
  FirstName: string
  LastName: string
  Email: string,
  LastBakedAt: Date
}

export const parseExcel = async (file: File) : Promise<FromExcelMember[]> => {
  const data = await file.arrayBuffer()
  const workbook = read(data, {type:"binary", cellDates: true})
  return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
}
