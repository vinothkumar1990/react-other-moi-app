import React, { useEffect, useState } from 'react'

import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
// import useFetch from './custom-hook/useFetch';
import {Atom} from 'react-loading-indicators'
// import { Slides } from './Slides';
import data from "../assets/mois.json"

import { Slides } from './Slides';



const columns = [
  { field: 'place', headerName: 'ஊர்', width: 230 },
  { field: 'name', headerName: 'பெயர்', width: 300 },
  
  {
    field: 'old_amount',
    headerName: 'பழைய பணம்',
    type: 'number',
    width: 150,
  },
  {
    field: 'new_amount',
    headerName: 'புதிய பணம்',
    type: 'number',
    width: 150,
  },
  {
    field: 'given_amount_status',
    headerName: 'தடவை',
    width: 90,
  },
  {
    field: 'function_name',
    headerName: 'திருமண விழா',
    width: 250,
  },
  
  
];



const paginationModel = { page: 0, pageSize: 20 };
export const MoiFilter = () => {
  // let {products, isLoading, setProducts}= useFetch("http://localhost:4000/mois");
  const [mois] = useState(
    data.map((row) => ({
      ...row,
      id: Number(row.id),
    }))
  );
          const [products, setproducts] = useState([]);
          const [loading, setLoading] = useState(true);
          useEffect(() => {
          const timer = setTimeout(() => {
            setproducts(data);
            setLoading(false);
          }, 1000); // 1 second loader
          return () => clearTimeout(timer);
        }, []);

      if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <center><Atom color="#32cd32" size="medium" text="" textColor="" /></center>
      </div>
    );
  }
  else{
      return (
          
      <Paper sx={{ height: 'auto', width: '100%'}}>
        <DataGrid
          rows={mois}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[30, 50, 100]}
          
          sx={{
      border: 0,
  
      // Header cells
      '& .MuiDataGrid-columnHeaders': {
        color: '#14a834ff',
      },
       '& .css-1gqmilo-MuiDataGrid-columnHeaderTitle': {
        'font-weight':'700',
      },
      
      // Body cells
      '& .MuiDataGrid-cell': {
        color: '#1c0449ff',
        'font-weight':'700',
      },
  
      // Row hover
      //'& .MuiDataGrid-row:hover': {
      //  backgroundColor: '#c7c5ddff',
     // },
      '& .css-s09cke-MuiTablePagination-selectLabel': {
        color: '#170c7cff',
        'font-weight':'700',
      },
      '& .css-sjsoon-MuiTablePaginationActions-root': {
        color: '#0c7c2eff',
        'margin-top': '-14px',
        
      },
      '& .css-11cfq65-MuiTablePagination-displayedRows': {
        color: '#0c7c2eff',
        'font-weight':'700',
        
      },
      '& .css-15lx25q-MuiDataGrid-footerContainer': {
        color: '#70706eff',
        
      },
      
    }}
        />
      </Paper>
    );
  }
  
}
