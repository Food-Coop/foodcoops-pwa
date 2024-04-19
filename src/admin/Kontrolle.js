import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import BTable from "react-bootstrap/Table";
import Alert from '@mui/material/Alert';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTable} from 'react-table';
import NumberFormatComponent from '../logic/NumberFormatComponent';
import {Button} from 'react-bootstrap';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import '../Table.css';

export function Kontrolle() {
    const api = useApi();
    const [discrepancy, setDiscrepancy] = useState([]);
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
        
      } = useTable({ columns, data: discrepancy})

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
                  let mixableDiscrepancy = json.discrepancy.filter(item => item.bestand.kategorie.mixable);
                  mixableDiscrepancy.sort((a, b) => {
                    const categoryComparison = a.bestand.kategorie.name.localeCompare(b.bestand.kategorie.name);
                    if (categoryComparison !== 0) {
                        return categoryComparison;
                    } else {
                        return a.bestand.name.localeCompare(b.bestand.name);
                    }
                });
                  let nonMixableDiscrepancy = json.discrepancy.filter(item => !item.bestand.kategorie.mixable);
                  nonMixableDiscrepancy.sort((a, b) => a.bestand.name.localeCompare(b.bestand.name));
                  let totalDiscrepancy = mixableDiscrepancy.concat(nonMixableDiscrepancy);
                  const filteredDiscrepancy = totalDiscrepancy.filter(item => item.zuVielzuWenig !== 0);
                  setDiscrepancy(filteredDiscrepancy);
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

      let currentCategoryTotal = 0;
      let currentCategory = null;
      let currentEinheit = null;

      rows.forEach((row, index) => {
          const discrepancy = row.cells[1].value;
          if (discrepancy !== 0 && row.original.bestand.kategorie.mixable) {
              if (currentCategory !== null && row.original.bestand.kategorie.name !== currentCategory) {
                  tableData.push([`Insgesamt Zu Viel / Zu Wenig für Kategorie ${currentCategory}`, currentCategoryTotal, currentEinheit]);
                  currentCategoryTotal = 0;
              }

              const rowData = [];
              row.cells.forEach(cell => {
                  rowData.push(cell.value);
              });
              tableData.push(rowData);

              currentCategory = row.original.bestand.kategorie.name;
              currentEinheit = row.original.bestand.einheit.name;
              currentCategoryTotal += row.original.zuVielzuWenig;
          }
      });

      if (currentCategory !== null) {
          tableData.push([`Insgesamt Zu Viel / Zu Wenig für Kategorie ${currentCategory}`, currentCategoryTotal, currentEinheit]);
      }
      rows.forEach((row, index) => {
      if (discrepancy !== 0 && (row.original.bestand.kategorie.mixable === false)) {
          const rowData = [];
          row.cells.forEach(cell => {
              rowData.push(cell.value);
          });
          tableData.push(rowData);
      }});

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

    
    let currentCategory = null;
    let currentEinheit = null;
    let totalZuVielZuWenig = 0;
    let rowsWithTotals = [];

    rows.forEach((row, index) => {
      prepareRow(row);
      if (row.original.zuVielzuWenig !== null && row.original.zuVielzuWenig !== undefined) {
        if (currentCategory !== null && row.original.bestand.kategorie.name !== currentCategory) {
          // Insert a row with the total for the previous category only if it's mixable
          if (currentCategory && rows.some(r => r.original.bestand.kategorie.name === currentCategory && r.original.bestand.kategorie.mixable)) {
            rowsWithTotals.push(
              <tr style={{ borderBottom: '2px solid grey', borderTop: '1px solid' }} key={`total-${currentCategory}`}>
                <td>Insgesamt Zu Viel / Zu Wenig für Kategorie <em>{currentCategory}</em></td>
                <td><b>{totalZuVielZuWenig}</b></td>
                <td>{currentEinheit}</td>
              </tr>
            );
          }
          totalZuVielZuWenig = 0;
        }
        currentCategory = row.original.bestand.kategorie.name;
        currentEinheit = row.original.bestand.einheit.name;
        if (row.original.bestand.kategorie.mixable) {
          totalZuVielZuWenig += row.original.zuVielzuWenig;
        }
        rowsWithTotals.push(
          <tr {...row.getRowProps()} key={`row-${index}`}>
            {row.cells.map(cell => {
              if (cell.column.Header === "Zu Viel / Zu Wenig") {
                let id = "InputfieldDiscr" + row.index;
                return (
                  <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Discr`}><input placeholder={row.original.zuVielzuWenig} id={id} type="number"></input></td>
                );
              } else {
                return <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Discr`} {...cell.getCellProps()}>{cell.render('Cell')}</td>
              }
            })}
          </tr>
        );
      }
    });
    
    if (currentCategory !== null && rows.some(r => r.original.bestand.kategorie.name === currentCategory && r.original.bestand.kategorie.mixable)) {
      rowsWithTotals.push(
        <tr style={{ borderBottom: '2px solid grey' }} key={`total-${currentCategory}`}>
          <td>Insgesamt Zu Viel / Zu Wenig für Kategorie <em>{currentCategory}</em></td>
          <td><b>{totalZuVielZuWenig}</b></td>
          <td>{currentEinheit}</td>
        </tr>
      );
    }

    const content = () => {
      if (discrepancy.length === 0) {
        return <p>Lädt...</p>;
      } else {
        return (
          <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th className="word-wrap" key={headerGroup.id + "HeaderDiscr"} {...column.getHeaderProps()}>
                        {column.render('Header')}
                    </th>
                ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rowsWithTotals}
            </tbody>
            </BTable>
        );
      }
    }

  return (
    <div>
      <div style={{overflowX: "auto", width: "100%"}}>
        <Alert severity="info" style={{margin: "0.5em 1em 0.5em 1em"}}>
        Bitte beachten Sie: Wenn Produkte geliefert wurden, jedoch in zu geringer Menge, müssen Sie die Bestellmenge mit einem Minuszeichen vorne angeben. <strong>Zum Beispiel</strong>: Wenn insgesamt <strong>10 Einheiten</strong> eines Produkts bestellt, aber nur <strong>8 Einheiten</strong> geliefert wurden, geben Sie für das Produkt in das Inputfield <strong>-2</strong> ein.
        </Alert>
        {content()}
        <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="success" onClick={() => submitUpdateDiscr()}>Aktualisieren</Button>
        <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="primary" onClick={() => generatePDF()}>PDF erstellen</Button>
        <ToastContainer />
      </div>
    </div>
  );
}