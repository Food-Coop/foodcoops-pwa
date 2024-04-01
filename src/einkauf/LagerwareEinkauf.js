import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import { useApi } from '../ApiService';
import BTable from "react-bootstrap/Table";

import NumberFormatComponent from '../logic/NumberFormatComponent';

export function LagerwareEinkauf(props) {
    const [produkt, setProdukt] = useState([]);
    const api = useApi();
    const [totalProduktPrice, setTotalProduktPrice] = useState(0);
    const NotAvailableColor = '#D3D3D3';

    const columns = React.useMemo(
        () => [
          {
            Header: 'Produkt',
            accessor: 'name',
          },
          {
            Header: 'Preis in €',
            accessor: 'preis',
            Cell: ({ value }) => <NumberFormatComponent value={value}/>,
          },
          {
            Header: 'genommene Menge',
            accessor: 'menge',
            Cell: ({ value }) => <NumberFormatComponent value={value}/>,
          },
          {
            Header: 'Einheit',
            accessor: 'lagerbestand.einheit.name',
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
        
      } = useTable({ columns, data: produkt, initialState: { sortBy: [{ id: 'name' }] }, }, useSortBy)

    const handleChange = () => {
        let preis = 0;
        for(let i = 0; i < produkt.length; i++){
            let bestellId = "InputfieldLager" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            let preisId = "PreisIdLager" + i;
            preis += document.getElementById(preisId).innerText.replace(',', '.') * bestellmenge;
        }
        setTotalProduktPrice(preis);
    };

    useEffect(() => {
        const fetchProdukt = async () => {
            try {
                const response = await api.readProdukt();
                const data = await response.json();
                setProdukt(data._embedded.produktRepresentationList);
            } catch (error) {
                console.error('Error fetching produkt:', error);
            }
        };

        fetchProdukt();
    }, []);

    useEffect(() => {
        if (props.onPriceChange) {
          props.onPriceChange(totalProduktPrice);
        }     
      }, [totalProduktPrice]);

    useEffect(() => {
        if (props.handleProdukt) {
            props.handleProdukt(produkt);
        }        
    }, [produkt]);

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
                    if (cell.column.Header == "Preis in €"){
                        let id = "PreisIdLager" + row.index;
                        return(
                            <td style={{color: row.original.lagerbestand.istLagerbestand === 0 ? NotAvailableColor : ''}} id={id} >{cell.render('Cell')}</td>
                        );
                    }
                    else
                    if(cell.column.Header == "genommene Menge"){
                        let id = "InputfieldLager" + row.index;
                        return(
                            <td><input id={id} type="number" min="0" onChange={() => handleChange()} disabled={row.original.lagerbestand.istLagerbestand === 0}></input></td>
                        );
                }
                else {
                    return <td style={{color: row.original.lagerbestand.istLagerbestand === 0 ? NotAvailableColor : ''}} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                }
                  })}
                </tr>
              )
            })}
          </tbody>
          </BTable>
    );
}