import React, { useState, useEffect } from 'react';
import { useApi } from '../ApiService';
import { useKeycloak } from "@react-keycloak/web";
import BTable from "react-bootstrap/Table";
import { useTable, useSortBy } from 'react-table';
import NumberFormatComponent from '../logic/NumberFormatComponent';

export function Kontrolle(props) {
    const [discrepancyList, getDiscrepancyList] = useState([]);
    const api = useApi();
    const { keycloak } = useKeycloak();
    const [totalFrischPrice, setTotalFrischPrice] = useState(0);
    const NotAvailableColor = '#D3D3D3';

    const columns = React.useMemo(
        () => [
          {
            Header: 'Produkt',
            accessor: 'discrepancy.bestand.name',
          },
          {
            Header: 'Zu Viel / Zu Wenig',
            accessor: 'discrepancy.bestand.zuVielzuWenig',
            Cell: ({ value }) => <NumberFormatComponent value={value}/>,
          },
          {
            Header: 'Einheit',
            accessor: 'discrepancy.bestand.kategorie.name',
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
        
      } = useTable({ columns, data: discrepancyList, initialState: { sortBy: [{ id: 'descrepandy.Sbestand.name' }] }, }, useSortBy)

    const handleChange = () => {
        let preis = 0;
        for(let i = 0; i < discrepancyList.length; i++){
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

        const fetchBestellUebersicht = async () => {
          try {
              const response = await api.readDiscrepancyOverviwe();
              const data = await response.text();
              console.log(data)
              if (data) {
                const json = JSON.parse(data);
                if (json.discrepancyList === 0) {
                  return;
                } else {
                  getDiscrepancyList(json.discrepancyList);
                }
              } else {
                return;
              }
          } catch (error) {
              console.error('Error fetching discrepancy:', error);
          }
        };
        fetchBestellUebersicht();
    }, []);

    const discrepancyObj = discrepancyList.reduce((obj, item) => {
      obj[item.discrepancy.bestand.name] = item;
      return obj;
    }, {});

    useEffect(() => {
        if (props.onPriceChange) {
          props.onPriceChange(totalFrischPrice);
        }
      }, [totalFrischPrice]);

    useEffect(() => {
        if (props.handleFrisch) {
            props.handleFrisch(discrepancyList);
        }        
    }, [discrepancyList]);

    const content = () => {
      if (discrepancyList.length === 0) {
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
                        {column.Header === "Bestellmenge" && rows.some(row => discrepancyObj[row.original.frischbestand.name]?.zuVielzuWenig < 0) ? <span style={{color: 'red', fontWeight: 300, fontSize: "15px"}}> (zu Wenig)</span> : ''}
                        {column.Header === "Bestellmenge" && rows.some(row => discrepancyObj[row.original.frischbestand.name]?.zuVielzuWenig > 0) ? <span style={{color: 'green', fontWeight: 300, fontSize: "15px"}}> (zu Viel)</span> : ''}
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
                        const discrepancy = discrepancyObj[row.original.discrepancy.bestand.name];
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
                        } else if(cell.column.Header === "Bestellmenge"){
                          return (
                            <td key={`${row.original.id}-${cell.column.Header}Frisch`} style={{color: row.original.frischbestand.verfuegbarkeit === false ? NotAvailableColor : ''}} {...cell.getCellProps()}>
                              {cell.render('Cell')} 
                              {discrepancy && discrepancy.zuVielzuWenig < 0 ? <span style={{color: 'red'}}> ( <NumberFormatComponent value={discrepancy.zuVielzuWenig} includeFractionDigits={false}/> )</span> : ''}
                              {discrepancy && discrepancy.zuVielzuWenig > 0 ? <span style={{color: 'green'}}> ( <NumberFormatComponent value={discrepancy.zuVielzuWenig} includeFractionDigits={false}/> )</span> : ''}
                            </td>
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