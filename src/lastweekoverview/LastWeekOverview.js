import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import BTable from "react-bootstrap/Table";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTable, useSortBy } from 'react-table';
import NumberFormatComponent from '../logic/NumberFormatComponent';
import {Button} from 'react-bootstrap';
import {jsPDF} from "jspdf";
import 'jspdf-autotable';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';

export function LastWeekOverview() {
    const api = useApi();
    const [discrepancy, setDiscrepancy] = useState([]);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);
    const [inputValues, setInputValues] = useState({});


    const columns = React.useMemo(
        () => [
            {
            Header: 'Produkt',
            accessor: 'bestand.name',
            },
            {
            Header: 'Menge',
            accessor: 'gewollteMenge',
            Cell: ({ value }) => <NumberFormatComponent value={value}/>,
            },
            {
            Header: 'Einheit',
            accessor: 'bestand.einheit.name',
            },
            {
            Header: 'Gebindegröße',
            accessor: 'bestand.gebindegroesse',
            },
            {
            Header: 'Zubestelende Gebinde',
            accessor: 'zuBestellendeGebinde',
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
        doc.text("Bestellübersicht", 10, 10);
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
        doc.save("Bestelluebersicht_Frisch_Tabelle.pdf");
      };

    const handleChange = (id, value) => {
        setInputValues(prev => ({ ...prev, [id]: value }));
      };

    const submitUpdateOverview = async () => {
    let errorOccurred = false;
    const apiCalls = [];
    for(let i = 0; i < discrepancy.length; i++){
        const discrId = discrepancy[i].id;
        const name = discrepancy[i].bestand.name;
        const inputField = document.getElementById("InputfieldGebinde" + i);

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

        const placeholderValue = parseFloat(discrepancy[i].zuBestellendeGebinde);

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
    forceUpdate();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const contentFrisch = () => {
    if (discrepancy.length === 0) {
        return null;
        } else {
        return (
            <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                    <th key={headerGroup.id + "HeaderGebinde"} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                if(cell.column.Header === "Zubestelende Gebinde"){
                                let id = "InputfieldGebinde" + row.index;
                                return(
                                    <td key={`${row.original.id}-${cell.column.Header}Gebinde`}><input value={inputValues[id] || row.original.zuBestellendeGebinde} onChange={(e) => handleChange(id, e.target.value)} id={id} type="number"></input></td>
                                );
                                } else {
                                return <td key={`${row.original.id}-${cell.column.Header}Gebinde`} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                }
                            })}
                        </tr>
                    )
                }
                )}
            </tbody>
            </BTable>
        );
        }
    }

    return(
        <div>
            <dic style={{overflowX: "auto", width: "100%"}}>
            <Accordion>
                <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" gutterBottom>Bestellungübersicht Frisch</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {contentFrisch()}
                </AccordionDetails>
            </Accordion>
                <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="success" onClick={() => submitUpdateOverview()}>Aktualisieren</Button>
                <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="primary" onClick={() => generatePDF()}>PDF erstellen</Button>
                <ToastContainer />
            </dic>
        </div>
    )
}