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
    const NotAvailableColor = '#D3D3D3';

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

    //TODO. switch to betweenDates
    useEffect(() => {
        const fetchFrischBestellung = async () => {
            try {
              let person_id = keycloak.tokenParsed.preferred_username;
              const response = await api.readFrischBestellungProPerson(person_id);
              const data = await response.json();
              if (!data._embedded || data._embedded.frischBestellungRepresentationList.length === 0) {
                return;
              } else {
                setFrischBestellung(data._embedded.frischBestellungRepresentationList);
              }
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

    const content = () => {
      if (frischBestellung.length === 0) {
        return null;
      } else {
        return (
          <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th key={headerGroup.id + "HeaderFrisch"} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                          let id = "PreisIdFrisch" + row.index;
                          return(
                            <td key={`${row.original.id}-${cell.column.Header}Frisch`} style={{color: row.original.frischbestand.verfuegbarkeit === false ? NotAvailableColor : ''}} id={id} >{cell.render('Cell')}</td>
                          );
                        } else if(cell.column.Header === "genommene Menge"){
                          let id = "InputfieldFrisch" + row.index;
                          return(
                            <td key={`${row.original.id}-${cell.column.Header}Frisch`}><input id={id} type="number" min="0" step={getStepValue(row.original.frischbestand.einheit.name)} onChange={() => handleChange()} disabled={row.original.frischbestand.verfuegbarkeit === false} ></input></td>
                          );
                        } else {
                          return <td key={`${row.original.id}-${cell.column.Header}Frisch`} style={{color: row.original.frischbestand.verfuegbarkeit === false ? NotAvailableColor : ''}} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                        }
                    })}
                  </tr>
                )
              })}
            </tbody>
            </BTable>
        );
      }
    }

  return content();
}
