import { DataGrid, GridColDef } from '@mui/x-data-grid'

import { MemberRow } from '@/pages/team/mine'

export const MemberTable = ({rows, columns} : {rows: MemberRow[], columns: GridColDef[]}) => {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ flexGrow: 1 }}>
        <DataGrid
          sx={{
            boxShadow: 2,
            border: 2,
            borderColor: '#1B9AAA',
            '& .MuiDataGrid-columnHeaders': {
              borderColor: '#1B9AAA'
            },
            '& .MuiDataGrid-cell': {
              borderColor: '#1B9AAA',
            },
            '& .MuiDataGrid-columnHeader:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-cell:focus-within': {
              outline: 'none',
            },
            '& .MuiDataGrid-footerContainer': {
              borderColor: '#1B9AAA',
            },
            '& .MuiDataGrid-iconSeparator': {
              color: '#1B9AAA',
            }
          }}
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>
    </div>
  )
}
