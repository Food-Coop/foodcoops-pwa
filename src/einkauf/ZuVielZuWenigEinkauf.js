import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy } from 'react-table';
import NumberFormatComponent from '../logic/NumberFormatComponent';

export function ZuVielZuWenigEinkauf(props) {
    const [discrepancy, setDiscrepancy] = useState([]);
    const api = useApi();
    const [totalDiscrepancyPrice, setTotalDiscrepancyPrice] = useState(0);
    const NotAvailableColor = '#D3D3D3';

    const columns = React.useMemo(
        () => [
          {
            Header: 'Produkt',
            accessor: 'bestand.name',
          },
          {
            Header: 'Preis in €',
            accessor: 'bestand.preis',
            Cell: ({ value }) => <NumberFormatComponent value={value}/>,
          },
          {
            Header: 'insgesamte Bestellmenge',
            accessor: 'gewollteMenge',
            Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
          },
          {
            Header: 'zu Viel / zu Wenig',
            accessor: 'zuVielzuWenig',
            Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
          },
          {
            Header: 'genommene Menge',
            accessor: 'menge',
            Cell: ({ value }) => <NumberFormatComponent value={value}/>,
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

    const handleChange = () => {
        let preis = 0;
        for(let i = 0; i < discrepancy.length; i++){
            let id = "InputfieldDiscrepancy" + i;
            let bestellmenge = document.getElementById(id).value;
            let preisId = "PreisIdDiscrepancy" + i;
            preis += document.getElementById(preisId).innerText.replace(',', '.') * bestellmenge;
        }
        setTotalDiscrepancyPrice(preis);
    };

    useEffect(() => {
        const fetchBestellUebersicht = async () => {
            try {
                const response = await api.readBestellUebersicht();
                const data = await response.json();
                setDiscrepancy(data.discrepancy);
            } catch (error) {
                console.error('Error fetching discrepancy:', error);
            }
        };
        

        fetchBestellUebersicht();
    }, []);

    useEffect(() => {
        if (props.onPriceChange) {
          props.onPriceChange(totalDiscrepancyPrice);
        }
      }, [totalDiscrepancyPrice]);

    useEffect(() => {
        if (props.handleDiscrepancy) {
            props.handleDiscrepancy(discrepancy);
        }        
    }, [discrepancy]);

    return (
        <BTable striped bordered hover size="sm" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
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
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    if (cell.column.Header === "Preis in €"){
                        let id = "PreisIdDiscrepancy" + row.index;
                        return(
                            <td style={{color: row.original.bestand.verfuegbarkeit === false ? NotAvailableColor : ''}} id={id} >{cell.render('Cell')}</td>
                        );
                    }
                    else if(cell.column.Header === "genommene Menge"){
                        let id = "InputfieldDiscrepancy" + row.index;
                        return(
                            <td><input id={id} type="number" min="0" onChange={() => handleChange()} disabled={row.original.bestand.verfuegbarkeit === false}></input></td>
                        );
                    } else if(cell.column.Header === "zu Viel / zu Wenig"){
                        return(
                            <td style={{color: row.original.bestand.verfuegbarkeit === false ? NotAvailableColor : '', border: row.original.zuVielzuWenig < 0 ? '2px solid red' : row.original.zuVielzuWenig > 0 ? '2px solid green' : ''}} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        );
                    } else {
                        return <td style={{color: row.original.bestand.verfuegbarkeit === false ? NotAvailableColor : ''}} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    }
                  })}
                </tr>
              )
            })}
          </tbody>
          </BTable>
    );
}
