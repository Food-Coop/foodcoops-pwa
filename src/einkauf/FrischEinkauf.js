import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import { useKeycloak } from "@react-keycloak/web";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy } from 'react-table';
import NumberFormatComponent from '../logic/NumberFormatComponent';

export function FrischEinkauf(props) {
    const [frischBestellung, setFrischBestellung] = useState([]);
    const api = useApi();
    const { keycloak } = useKeycloak();
    const [totalFrischPrice, setTotalFrischPrice] = useState(0);

    const columns = React.useMemo(
        () => [
          {
            Header: 'Produkt',
            accessor: 'frischbestand.name',
          },
          {
            Header: 'Preis in €',
            accessor: 'frischbestand.preis',
            Cell: ({ value }) => <NumberFormatComponent value={value}/>,
          },
          {
            Header: 'Gebindegröße',
            accessor: 'frischbestand.gebindegroesse',
            Cell: ({ value }) => <NumberFormatComponent value={value} includeFractionDigits={false}/>,
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
          {
            Header: 'Einheit',
            accessor: 'frischbestand.einheit.name',
          },
          {
            Header: 'Kategorie',
            accessor: 'frischbestand.kategorie.name',
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
        
      } = useTable({ columns, data: frischBestellung, initialState: { sortBy: [{ id: 'frischbestand.kategorie.name' }] }, }, useSortBy)

    const handleChange = () => {
        let preis = 0;
        for(let i = 0; i < frischBestellung.length; i++){
            let bestellId = "InputfieldFrisch" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            let preisId = "PreisIdFrisch" + i;
            preis += document.getElementById(preisId).innerText.replace(',', '.') * bestellmenge;
        }
        setTotalFrischPrice(preis);
    };
      

    const getStepValue = (einheit) => {
        const lowerCaseEinheit = einheit.toLowerCase();
        if (lowerCaseEinheit === 'kg') {
            return 0.2;
        } else {
            return 1;
        }
    };

    useEffect(() => {
        const fetchFrischBestellung = async () => {
            try {
                let person_id = keycloak.tokenParsed.preferred_username;
                const response = await api.readFrischBestellungProPerson(person_id);
                const data = await response.json();
                setFrischBestellung(data._embedded.frischBestellungRepresentationList);
            } catch (error) {
                console.error('Error fetching frischBestellung:', error);
            }
        };

        fetchFrischBestellung();
    }, []);

    useEffect(() => {
        if (props.onPriceChange) {
          props.onPriceChange(totalFrischPrice);
        }
      }, [totalFrischPrice]);

    useEffect(() => {
        if (props.handleFrisch) {
            props.handleFrisch(frischBestellung);
        }        
    }, [frischBestellung]);

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
                        let id = "PreisIdFrisch" + row.index;
                        return(
                            <td id={id} >{cell.render('Cell')}</td>
                        );
                    }
                    else
                    if(cell.column.Header == "genommene Menge"){
                        let id = "InputfieldFrisch" + row.index;
                        return(
                            <td><input id={id} type="number" min="0" step={getStepValue(row.original.frischbestand.einheit.name)} onChange={() => handleChange()} ></input></td>
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
