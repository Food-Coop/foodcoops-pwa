import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import { useKeycloak } from "@react-keycloak/web";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy } from 'react-table';
import NumberFormatComponent from '../logic/NumberFormatComponent';

export function BrotEinkauf(props) {
    const [brotBestellung, setBrotBestellung] = useState([]);
    const api = useApi();
    const { keycloak } = useKeycloak();
    const [totalBrotPrice, setTotalBrotPrice] = useState(0);

    const columns = React.useMemo(
        () => [
          {
            Header: 'Produkt',
            accessor: 'brotbestand.name',
          },
          {
            Header: 'Preis in €',
            accessor: 'brotbestand.preis',
            Cell: ({ value }) => <NumberFormatComponent value={value}/>,
          },
          {
            Header: 'Bestellmenge',
            accessor: 'bestellmenge',
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
        
      } = useTable({ columns, data: brotBestellung, initialState: { sortBy: [{ id: 'brotbestand.name' }] }, }, useSortBy)

    const handleChange = () => {
        let preis = 0;
        for(let i = 0; i < brotBestellung.length; i++){
            let bestellId = "InputfieldBrot" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            let preisId = "PreisIdBrot" + i;
            preis += document.getElementById(preisId).innerText.replace(',', '.') * bestellmenge;
        }
        setTotalBrotPrice(preis);
    };

    useEffect(() => {
        const fetchBrotBestellung = async () => {
            try {
                let person_id = keycloak.tokenParsed.preferred_username;
                const response = await api.readBrotBestellungProPerson(person_id);
                const data = await response.json();
                setBrotBestellung(data?._embedded?.brotBestellungRepresentationList);
            } catch (error) {
                console.error('Error fetching brotBestellung:', error);
            }
        };
        

        fetchBrotBestellung();
    }, []);

    useEffect(() => {
        if (props.onPriceChange) {
          props.onPriceChange(totalBrotPrice);
        }
      }, [totalBrotPrice]);

    useEffect(() => {
        if (props.handleBrot) {
            props.handleBrot(brotBestellung);
        }        
    }, [brotBestellung]);

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
                        let id = "PreisIdBrot" + row.index;
                        return(
                            <td id={id} >{cell.render('Cell')}</td>
                        );
                    }
                    else
                    if(cell.column.Header == "genommene Menge"){
                        let id = "InputfieldBrot" + row.index;
                        return(
                            <td><input id={id} type="number" min="0" onChange={() => handleChange()} ></input></td>
                        );
                }
                else {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                }
                  })}
                </tr>
              )
            })}
          </tbody>
          </BTable>
    );
}
