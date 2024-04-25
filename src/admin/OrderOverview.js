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

export function OrderOverview() {
    const api = useApi();
    const [discrepancy, setDiscrepancy] = useState([]);
    const [brotBestellungOverview, setBrotBestellungOverview] = useState([]);
    const [reducerValue, forceUpdate] = React.useReducer(x => x+1, 0);

    const columns = React.useMemo(
        () => [
            {
            Header: 'Produkt',
            accessor: 'bestand.name',
            },
            {
            Header: 'Bestellmenge',
            accessor: 'gewollteMenge',
            Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
            },
            {
            Header: 'Einheit',
            accessor: 'bestand.einheit.name',
            },
            {
            Header: 'Gebindegröße',
            accessor: 'bestand.gebindegroesse',
            Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
            },
            {
            Header: 'Zu bestellende Gebinde',
            accessor: 'zuBestellendeGebinde',
            Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
            },
        ],
        []
    )

    const brotColumns = React.useMemo(
        () => [
            {
                Header: 'Produkt',
                accessor: 'brotBestand.name',
            },
            {
                Header: 'Zu bestellende Menge',
                accessor: 'bestellmenge',
                Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
            }
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        
    } = useTable({ columns, data: discrepancy, initialState: { sortBy: [{ id: 'bestand.name' }] }, }, useSortBy)

    const {
        getTableProps: getBrotBestellungTableProps,
        getTableBodyProps: getBrotBestellungTableBodyProps,
        headerGroups: brotBestellungHeaderGroups,
        rows: brotBestellungRows,
        prepareRow: prepareBrotBestellungRow,
    } = useTable({columns: brotColumns, data: brotBestellungOverview}, useSortBy);

    useEffect(() => {
        const fetchBestellUebersicht = async () => {
            try {
                const response = await api.readBestellUebersicht();
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                //console.log(data)
                if (data && Array.isArray(data.discrepancy)) {
                    setDiscrepancy(data.discrepancy);
                } else {
                    setDiscrepancy([]);
                }

                if (Array.isArray(data.brotBestellung)) {
                    setBrotBestellungOverview(data.brotBestellung);
                } else {
                    setBrotBestellungOverview([]);
                }
            } catch (error) {
                console.error('Error fetching discrepancy:', error);
            }
        };
        fetchBestellUebersicht();
    }, [reducerValue]);

    const generateCombinedPDF = () => {
        const doc = new jsPDF();
    
        // Bestellübersicht - Brotbestellungen
        doc.text("Bestellübersicht - Brotbestellungen", 10, 10);
        const brotTableData = [];
        const brotColumns = [];
        brotBestellungHeaderGroups.forEach(headerGroup => {
            headerGroup.headers.forEach(column => {
                brotColumns.push(column.Header);
            });
        });
        brotTableData.push(brotColumns);
        brotBestellungRows.forEach(row => {
            const brotBestellungOverview = row.cells[1].value;
            if (brotBestellungOverview !== 0) {
                const rowData = [];
                row.cells.forEach(cell => {
                    rowData.push(cell.value);
                });
                brotTableData.push(rowData);
            }
        });
        doc.autoTable({
            head: [brotTableData.shift()],
            body: brotTableData
        });
        doc.addPage(); // Neue Seite für die nächste Tabelle
    
        // Bestellübersicht - Frischbestellungen
        doc.text("Bestellübersicht - Frischbestellungen", 10, 10);
        const freshTableData = [];
        const freshColumns = [];
        headerGroups.forEach(headerGroup => {
            headerGroup.headers.forEach(column => {
                freshColumns.push(column.Header);
            });
        });
        freshTableData.push(freshColumns);
        rows.forEach(row => {
            const discrepancy = row.cells[1].value;
            if (discrepancy !== 0) {
                const rowData = [];
                row.cells.forEach(cell => {
                    rowData.push(cell.value);
                });
                freshTableData.push(rowData);
            }
        });
        doc.autoTable({
            head: [freshTableData.shift()],
            body: freshTableData
        });
    
        // Speichern des kombinierten PDFs
        doc.save("Kombinierte_Bestelluebersicht.pdf");
    };

    const generatePDFforBrot = () => {
        api.getUebersichtBrotByte()
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                const binaryString = window.atob(json.pdf);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes.buffer], {type: "application/pdf"});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', (json.filename + '.pdf'));
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => console.error(error));
    };

    const generatePDF = () => {
        api.getUebersichtFrischByte()
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                const binaryString = window.atob(json.pdf);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const blob = new Blob([bytes.buffer], {type: "application/pdf"});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', (json.filename + '.pdf'));
                document.body.appendChild(link);
                link.click();
            })
            .catch((error) => console.error(error));
      };

    const clearInputFields = () => {
        for (let i = 0; i < discrepancy.length; i++) {
            let discrId = "InputfieldGebinde" + i;
            document.getElementById(discrId).value = "";
        }
    }

    const submitUpdateOverview = async () => {
    let errorOccurred = false;
    const apiCalls = [];
    for(let i = 0; i < discrepancy.length; i++){
        const discrId = discrepancy[i].id;
        const inputField = document.getElementById("InputfieldGebinde" + i);

        if (inputField !== null && inputField !== undefined && inputField !== 0) {
        const inputValue = inputField.value.trim();

        if(inputValue !== ''){
            apiCalls.push(api.updateGebindeOverview(discrId, inputValue));
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
    clearInputFields();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const contentBrot = () => {
        if (brotBestellungOverview.length === 0) {
            return <p>Es gibt aktuell keine Brotbestellungen</p>;
        } else {
            return (
                <div className="tableFixHead">
                <BTable striped bordered hover size="sm" {...getBrotBestellungTableProps()}>
                    <thead>
                        {brotBestellungHeaderGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {column.render('Header')}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getBrotBestellungTableBodyProps()}>
                        {brotBestellungRows.map((row) => {
                            prepareBrotBestellungRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return <td key={`${row.original.id}-${cell.column.Header}Brot`} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </BTable>
                </div>
            );
        }
    };

    const contentFrisch = () => {
    if (discrepancy.length === 0) {
        return <p>Es gibt aktuell keine Frischbestellungen.</p>;
        } else {
        return (
            <div className="tableFixHead">
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
                                if(cell.column.Header === "Zu bestellende Gebinde"){
                                let id = "InputfieldGebinde" + row.index;
                                return(
                                    <td key={`${row.original.id}-${cell.column.Header}Gebinde`}><input placeholder={row.original.zuBestellendeGebinde} id={id} type="number"></input></td>
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
            </div>
        );
        }
    }

    return(
        <div>
            <div style={{overflowX: "auto", width: "100%"}}>
            <Accordion defaultExpanded>
                <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" gutterBottom>Frisch</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {contentFrisch()}
                    <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="success" onClick={() => submitUpdateOverview()}>Aktualisieren</Button>
                    <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="primary" onClick={() => generatePDF()}>Download Frischbestellungen als PDF</Button>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary aria-controls="panel1-content" id="panel1-header"  expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h6" gutterBottom>Brot</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {contentBrot()}
                    <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="primary" onClick={() => generatePDFforBrot()}>Download Brotbestellungen als PDF</Button>
                </AccordionDetails>
            </Accordion>
                <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="primary" onClick={() => generateCombinedPDF()}>Download Übersicht als PDF</Button>
                <ToastContainer />
            </div>
        </div>
    )
}