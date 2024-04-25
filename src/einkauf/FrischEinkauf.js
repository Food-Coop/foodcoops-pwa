import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import { useKeycloak } from "@react-keycloak/web";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy } from 'react-table';
import NumberFormatComponent from '../logic/NumberFormatComponent';
import '../Table.css';

export function FrischEinkauf(props) {
    const [frischBestellung, setFrischBestellung] = useState([]);
    const [discrepancy, setDiscrepancy] = useState([]);
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
        
      } = useTable({ columns, data: frischBestellung, }, useSortBy)

    const handleChange = () => {
        let preis = 0;
        for(let i = 0; i < frischBestellung.length; i++){
            let bestellId = "InputfieldFrisch" + i;
            //if discrepancy.done is true
            if (document.getElementById(bestellId) === null) {
              continue;
            }
            let bestellmenge = document.getElementById(bestellId).value || 0;
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
              const response = await api.readFrischBestellungBetweenDatesProPerson(person_id);
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
    },[props.forceUpdate]);

    const discrepancyObj = discrepancy.reduce((obj, item) => {
      obj[item.bestand.name] = item;
      return obj;
    }, {});

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
          <div className="tableFixHead">
          <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map(column => (
                    <th className="word-wrap" key={headerGroup.id + "HeaderFrisch"} {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        {column.Header === "Bestellmenge" && rows.some(row => discrepancyObj[row.original.frischbestand.name]?.zuBestellendeGebinde !== 0 && discrepancyObj[row.original.frischbestand.name]?.zuVielzuWenig < 0) ? <span style={{color: 'red', fontWeight: 300, fontSize: 'var(--zuVielzuWenigFrischEinkauf-font-size)'}}> (zu Wenig)</span> : ''}
                        {column.Header === "Bestellmenge" && rows.some(row => discrepancyObj[row.original.frischbestand.name]?.zuBestellendeGebinde !== 0 && discrepancyObj[row.original.frischbestand.name]?.zuVielzuWenig > 0) ? <span style={{color: 'green', fontWeight: 300, fontSize: 'var(--zuVielzuWenigFrischEinkauf-font-size)'}}> (zu Viel)</span> : ''}
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
                  if (row.original.done === false) {
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map(cell => {
                            const discrepancy = discrepancyObj[row.original.frischbestand.name];
                            if(discrepancy !== undefined){
                            if (cell.column.Header === "Preis in €"){
                              let id = "PreisIdFrisch" + row.index;
                              return(
                                <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Frisch`} style={{color: row.original.frischbestand.verfuegbarkeit === false ? NotAvailableColor : '' || discrepancy.zuBestellendeGebinde === 0 ? NotAvailableColor : '' }}>
                                  <span id = {id}>{cell.render('Cell')}</span>
                                  <span>{row.original.frischbestand.spezialfallBestelleinheit === true ? ' (Kg)' : ''}</span>
                                </td>
                              );
                            } else if(cell.column.Header === "genommene Menge"){
                              let id = "InputfieldFrisch" + row.index;
                              if(discrepancy.zuBestellendeGebinde === 0){
                                return (
                                  <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Frisch`} style={{color: 'red' }} id={id} >Kein Gebinde entstanden</td>
                                );
                              } else {
                                return(
                                  <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Frisch`}><input className='einkauf-inputfield-size' id={id} type="number" min="0" step={getStepValue(row.original.frischbestand.einheit.name)} onChange={() => handleChange()} disabled={row.original.frischbestand.verfuegbarkeit === false} ></input></td>
                                );
                              }
                            } else if(cell.column.Header === "Einheit"){
                              return(
                                  <td className="word-wrap" style={{color: row.original.frischbestand.verfuegbarkeit === false ? NotAvailableColor : ''}} key={row.index}{...props} >
                                    {row.original.frischbestand.spezialfallBestelleinheit === true ? <span style={{fontWeight: 'bold', color: 'red'}}>{cell.render('Cell')}</span> : cell.render('Cell')} 
                                  </td>
                              );
                            } else if(cell.column.Header === "Bestellmenge"){
                              return (
                                <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Frisch`} style={{color: row.original.frischbestand.verfuegbarkeit === false ? NotAvailableColor : '' || discrepancy.zuBestellendeGebinde === 0 ? NotAvailableColor : '' }} {...cell.getCellProps()}>
                                  {cell.render('Cell')} 
                                  {discrepancy && discrepancy.zuBestellendeGebinde !== 0 && discrepancy.zuVielzuWenig < 0 ? <span style={{color: 'red'}}> ( <NumberFormatComponent value={discrepancy.zuVielzuWenig} includeFractionDigits={false}/> )</span> : ''}
                                  {discrepancy && discrepancy.zuBestellendeGebinde !== 0 && discrepancy.zuVielzuWenig > 0 ? <span style={{color: 'green'}}> ( <NumberFormatComponent value={discrepancy.zuVielzuWenig} includeFractionDigits={false}/> )</span> : ''}
                                  {row.original.frischbestand.spezialfallBestelleinheit === true ? ' Stück' : ''}
                                </td>
                              );
                            } else {
                              return <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Frisch`} style={{color: row.original.frischbestand.verfuegbarkeit === false ? NotAvailableColor : '' || discrepancy?.zuBestellendeGebinde === 0 ? NotAvailableColor : '' }} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            }
                        } else {
                          return null;
                        }
                      })}
                      </tr>
                    )
              } else {
                return null;
              }})}
            </tbody>
            </BTable>
            </div>
        );
      }
    }

  return content();
}
