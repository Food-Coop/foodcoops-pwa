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
import { AddNewFrischModal } from './AddNewFrischModal';
import '../Table.css';

export function Kontrolle() {
    const api = useApi();
    const [discrepancy, setDiscrepancy] = useState([]);
    const [frischBestandForModal, setFrischBestandForModal] = useState([]);
    const [discrepancyForModal, setDiscrepancyForModal] = useState([]);
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

                  setDiscrepancyForModal(totalDiscrepancy);
                }
              } else {
                return;
              }
          } catch (error) {
              console.error('Error fetching discrepancy:', error);
          }
        };
        fetchBestellUebersicht();
        const fetchFrischBestandForModal = async () => {
          try {
              const response = await api.readFrischBestand();
              const data = await response.json();
              if (!data._embedded || data._embedded?.frischBestandRepresentationList.length === 0) {
                return;
              } else {
                setFrischBestandForModal(data._embedded.frischBestandRepresentationList);
              }
          } catch (error) {
              console.error('Error fetching discrepancy:', error);
          }
        };
        fetchFrischBestandForModal();
    }, [reducerValue]);

    const updateParent = () => {
      forceUpdate();
    };

    const generatePDF = () => {
      const currentDate = new Date();
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}.${month}.${year}`;
      const doc = new jsPDF();
      doc.text(`Zu Viel / Zu Wenig-Liste ${formattedDate}`, 10, 10);
      const tableData = [];
      const columns = [];
      const insgesamtIndexes = [];
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
                  insgesamtIndexes.push(tableData.length-1);
                  tableData.push([`Insgesamt Zu Viel / Zu Wenig für Kategorie ${currentCategory}`, currentCategoryTotal.toString().replace('.', ','), currentEinheit]);
                  currentCategoryTotal = 0;
              }
    
              const rowData = [];
              row.cells.forEach(cell => {
                row.cells.forEach(cell => {
                  if (typeof cell.value === 'number' && cell.value.toString().includes('.')) {
                    const formattedValue = cell.value.toString().replace('.', ',');
                    rowData.push(formattedValue);
                  } else {
                    rowData.push(cell.value);
                  }});
              });
              tableData.push(rowData);
    
              currentCategory = row.original.bestand.kategorie.name;
              currentEinheit = row.original.bestand.einheit.name;
              currentCategoryTotal += row.original.zuVielzuWenig;
          }
      });
    
      if (currentCategory !== null) {
          insgesamtIndexes.push(tableData.length-1);
          tableData.push([`Insgesamt Zu Viel / Zu Wenig für Kategorie ${currentCategory}`, currentCategoryTotal.toString().replace('.', ','), currentEinheit]);
      }
      
      rows.forEach((row, index) => {
        const discrepancy = row.cells[1].value;
        if (discrepancy !== 0 && !row.original.bestand.kategorie.mixable) {
          const rowData = [];
          row.cells.forEach(cell => {
            if (typeof cell.value === 'number' && cell.value.toString().includes('.')) {
              const formattedValue = cell.value.toString().replace('.', ',');
              rowData.push(formattedValue);
            } else {
              rowData.push(cell.value);
            }
          });
          tableData.push(rowData);
        }
      });
      
    
      doc.autoTable({
          head: [tableData.shift()],
          body: tableData,
          didDrawCell: function(data) {
            if (data.section === 'body' && insgesamtIndexes.includes(data.row.index)) {
              doc.setDrawColor(0);
              doc.setLineWidth(1);
              doc.line(data.cell.x, data.cell.y + data.cell.height, data.cell.x + data.cell.width, data.cell.y + data.cell.height); // Bottom border
            }
          }
      });
      doc.save(`zuViel-zuWenig_Liste_${formattedDate}.pdf`);
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
        const inputField = document.getElementById("InputfieldDiscr" + i);

        if (inputField !== null && inputField !== undefined && inputField !== 0) {
          const inputValue = inputField.value.trim();
          let formatedValue = inputValue;

          if (inputValue === "") {
            continue;
          } else {
          const placeholderValue = parseFloat(discrepancy[i].zuVielzuWenig);

          if(formatedValue !== placeholderValue){
            apiCalls.push(api.updateDiscrepancy(discrId, formatedValue));
          }
          }
      }
      }
      try {
        const responses = await Promise.all(apiCalls);
        for (const response of responses) {
          if (!(response.ok)) {
            console.error(response.status);
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
        console.error(error);
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
                <td><b>{totalZuVielZuWenig.toString().replace('.', ',')}</b></td>
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
                  <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Discr`}><input placeholder={(row.original.zuVielzuWenig.toString()).replace('.', ',')} id={id} type="number"></input></td>
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
          <td><b>{totalZuVielZuWenig.toString().replace('.', ',')}</b></td>
          <td>{currentEinheit}</td>
        </tr>
      );
    }

    const content = () => {
      if (discrepancy.length === 0) {
        return <p style={{margin: "5em 1em 0.5em 1em"}}>Es gibt momentan nichts auf der Zu Viel / Zu Wenig-Liste</p>;
      } else {
        return (
          <div className="tableFixHead tFH-kontrolle">
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
          </div>
        );
      }
    }
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

  return (
    <div>
      <div style={{overflowX: "auto", width: "100%"}}>
            <Alert severity="info" style={{margin: "0.5em 1em 0.5em 1em"}}>
              Bitte beachten Sie: Wenn Produkte geliefert wurden, jedoch in zu geringer Menge, müssen Sie die Bestellmenge mit einem Minuszeichen vorne angeben. <strong>Zum Beispiel</strong>: Wenn insgesamt <strong>10 Einheiten</strong> eines Produkts bestellt, aber nur <strong>8 Einheiten</strong> geliefert wurden, geben Sie für das Produkt in das Inputfield <strong>-2</strong> ein.
            </Alert>
            <div>
            <Button style={{margin: "0 1em 0.5em 1em", float: "left"}} onClick={handleShowModal}>Produkt hinzufügen</Button>
            </div>
            <AddNewFrischModal show={showModal}
              close={handleCloseModal}
              updateParent={updateParent}
              frischBestandForModal={frischBestandForModal}
              discrepancyForModal={discrepancyForModal}/>
            {content()}
            <Button className='buttonForSubmitting' variant="success" onClick={() => submitUpdateDiscr()}>Aktualisieren</Button>
            <Button className='buttonForSubmitting' variant="primary" onClick={() => generatePDF()}>PDF erstellen</Button>
            <ToastContainer />
      </div>
    </div>
  );
}