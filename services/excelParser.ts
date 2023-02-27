import{ read, utils } from "xlsx"

export interface FromExcelMember {
  FirstName: string
  LastName: string
  Email: string
}

export const parseExcel = async (file: File) : Promise<FromExcelMember[]> => {
  const data = await file.arrayBuffer()
  const workbook = read(data)
  return utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
}
