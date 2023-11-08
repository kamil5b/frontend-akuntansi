import React, {useState,useEffect} from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from '../Title';
import { TableFooter } from '@mui/material';
import {
  TablePagination,
  tablePaginationClasses as classes,
} from '@mui/base/TablePagination';
//import Cookies from 'js-cookie';


// Generate Order Data
// function createItem(id, date, name, metric, barcode, multiplier, priceperunit) {
//   return { id, date, name, metric, barcode, multiplier, priceperunit };
// }

function preventDefault(event) {
  event.preventDefault();
}

function changeToRupiah(number){
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(
    number,
  )
}

export default function ItemTable(auth) {
  const [items, setItems] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  //const [auth,setAuth] = useState(null);
  //useEffect(() => setAuth("23123190237384392"),[])
  useEffect(() => {
    
    //setAuth(Cookies.get("token"));
    console.log(auth)
    fetch(`${process.env.REACT_APP_URL_ACCOUNTANCY_API}/item`, {
      method: "GET",
      headers: {
        "Authorization": auth.auth
        //  "Content-Type": "application/json"
      }
    }).then((response) => {
      if (!response.ok) {
        console.log(response)
     }
 
     return response.json();
    })
      .then((data) => {
        if(typeof data.data != "undefined") {
          setItems(data.data);
        }else{
          setItems([])
        }
        console.log(data);
      })
      .catch((error) => console.log(error));
    

  }, [auth]);

  const renderTable = () => {
    let item_data = items
    return item_data.map(row => {
      return (
        <TableRow key={row.ID}>
          <TableCell>{row.ID}</TableCell>
          <TableCell>{row.UpdatedAt}</TableCell>
          <TableCell>{row.name}</TableCell>
          <TableCell>{row.metric}</TableCell>
          <TableCell>{row.multiplier}</TableCell>
          <TableCell>{row.barcode}</TableCell>
          <TableCell align="right">{`${changeToRupiah(row.price_per_unit)}`}</TableCell>
        </TableRow>
      )
    })
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - items.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <React.Fragment>
      <Title>Item Table</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Metric</TableCell>
            <TableCell>Multiplier</TableCell>
            <TableCell>Barcode</TableCell>
            <TableCell align="right">Price Per Unit</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : items
          ).map((row) => (
            <TableRow key={row.ID}>
              <TableCell>{row.ID}</TableCell>
              <TableCell>{row.UpdatedAt}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.metric}</TableCell>
              <TableCell>{row.multiplier}</TableCell>
              <TableCell>{row.barcode}</TableCell>
              <TableCell align="right">{`${changeToRupiah(row.price_per_unit)}`}</TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <tr style={{ height: 41 * emptyRows }}>
              <td colSpan={7} aria-hidden />
            </tr>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
          <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={items.length}
              rowsPerPage={rowsPerPage}
              page={page}
              slotProps={{
                select: {
                  'aria-label': 'rows per page',
                },
                actions: {
                  showFirstButton: true,
                  showLastButton: true,
                },
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableRow>
        </TableFooter>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        See more orders
      </Link>
    </React.Fragment>
  );
}
