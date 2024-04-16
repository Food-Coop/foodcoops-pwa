import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import BTable from "react-bootstrap/Table";
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTable, useSortBy } from 'react-table';
import NumberFormatComponent from '../logic/NumberFormatComponent';
import {Button} from 'react-bootstrap';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import '../Table.css';

export function Kontrolle() {
    const [discrepancy, setDiscrepancy] = useState([]);
    const api = useApi();
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);

    const columns = React.useMemo(
        () => [
          {
            Header: 'Produkt',
            accessor: 'bestand.name',
          },
          {
            Header: 'Zu Viel / Zu Wenig',
            accessor: 'zuVielzuWenig',
            Cell: ({ value }) => <NumberFormatComponent value={value}/>,
          },
          {
            Header: 'Einheit',
            accessor: 'bestand.einheit.name',
          },
        ],
        []
    )

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        
      } = useTable({ columns, data: discrepancy, initialState: { sortBy: [{ id: 'bestand.name' }] }, }, useSortBy)

    useEffect(() => {
        const fetchBestellUebersicht = async () => {
          try {
              const response = await api.readBestellUebersicht();
              const data = await response.text();
              if (data) {
                const json = JSON.parse(data);
                if (json.discrepancy === 0) {
                  return;
                } else {
                  setDiscrepancy(json.discrepancy);
                }
              } else {
                return;
              }
          } catch (error) {
              console.error('Error fetching discrepancy:', error);
          }
        };
        fetchBestellUebersicht();
    }, [reducerValue]);

    const generatePDF = () => {
      const doc = new jsPDF();
      doc.text("Zu Viel / Zu Wenig-Tabelle", 10, 10);
      const tableData = [];
      const columns = [];
      headerGroups.forEach(headerGroup => {
          headerGroup.headers.forEach(column => {
              columns.push(column.Header);
          });
      });
      tableData.push(columns);
      rows.forEach(row => {
        //remove rows with discrepancy = 0
        const discrepancy = row.cells[1].value;
        if (discrepancy !== 0) {
          const rowData = [];
          row.cells.forEach(cell => {
          rowData.push(cell.value);
          });
          tableData.push(rowData);
        }
      });
      doc.autoTable({
          head: [tableData.shift()],
          body: tableData
      });
      doc.save("zuViel-zuWenig_Tabelle.pdf");
  };

  const clearInputFields = () => {
    const inputFields = document.querySelectorAll('input[type="number"]');
    inputFields.forEach((input) => {
      input.value = "";
    });
  };

    const submitUpdateDiscr = async () => {
      let errorOccurred = false;
      const apiCalls = [];
      for(let i = 0; i < discrepancy.length; i++){
        const discrId = discrepancy[i].id;
        const name = discrepancy[i].bestand.name;
        const inputField = document.getElementById("InputfieldDiscr" + i);

        if (inputField !== null && inputField !== undefined && inputField !== 0) {
          const inputValue = inputField.value.trim();
          let formatedValue;

          if (!isNaN(inputValue) && Number.isInteger(parseFloat(inputValue))) {
            formatedValue = inputValue + ".0";
          } else if (!isNaN(inputValue) && isFinite(parseFloat(inputValue))) {
            formatedValue = inputValue;
          } else {
            console.error("Invalid input for discrepancy: " + name);
            continue;
          }

          const placeholderValue = parseFloat(discrepancy[i].zuVielzuWenig);

          if(formatedValue !== placeholderValue){
            apiCalls.push(api.updateDiscrepancy(discrId, formatedValue));
          }
        }
      }
      try {
        const responses = await Promise.all(apiCalls);
        for (const response of responses) {
          if (!(response.ok)) {
            console.log(response.status);
            errorOccurred = true;
            break;
          }
        }

        if (!errorOccurred) {
          toast.success("Die Änderung wurden erfolgreich übermittelt.");
        } else {
          toast.error("Es gab einen Fehler beim Übermitteln der Änderungen. Bitte versuchen Sie es erneut.");
        }
      } catch (error) {
        errorOccurred = true;
        toast.error("Es gab einen Fehler beim Übermitteln der Änderungen. Bitte versuchen Sie es erneut.");
        console.log(error);
      }
      clearInputFields();
      forceUpdate();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const content = () => {
      if (discrepancy.length === 0) {
        return null;
      } else {
        return (
          <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th className="word-wrap" key={headerGroup.id + "HeaderDiscr"} {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        <span>
                            {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                        </span>
                    </th>
                ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row)
                if (row.original.zuVielzuWenig === 0 || row.original.zuVielzuWenig === null || row.original.zuVielzuWenig === undefined) {
                  return null
                } else {
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => {
                          if(cell.column.Header === "Zu Viel / Zu Wenig"){
                            let id = "InputfieldDiscr" + row.index;
                            return(
                              <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Discr`}><input placeholder={row.original.zuVielzuWenig} id={id} type="number"></input></td>
                            );
                          } else {
                            return <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Discr`} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                          }
                      })}
                    </tr>
                  )
                }
              })}
            </tbody>
            </BTable>
        );
      }
    }

  return (
    <div>
      <div style={{overflowX: "auto", width: "100%"}}>
        <Alert severity="info" style={{margin: "0.5em 1em 0.5em 1em"}}> 
          Wenn zu wenig von einem Produkt geliefert wurde, wird ein negativer Wert angezeigt. Wenn zu viel geliefert wurde, wird ein positiver Wert angezeigt.
        </Alert>
        {content()}
        <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="success" onClick={() => submitUpdateDiscr()}>Aktualisieren</Button>
        <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="primary" onClick={() => generatePDF()}>PDF erstellen</Button>
        <ToastContainer />
      </div>
    </div>
  );
}