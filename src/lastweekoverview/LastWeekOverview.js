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

    const handleChange = (id, value) => {
        setInputValues(prev => ({ ...prev, [id]: value }));
      };

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
                {content()}
                <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="success" /*onClick={() => submitUpdateDiscr()}*/>Aktualisieren</Button>
                <Button style={{margin: "20px 0.25rem 30px 0.25rem"}} variant="primary" /*onClick={() => generatePDF()}*/>PDF erstellen</Button>
                <ToastContainer />
            </dic>
        </div>
    )
}