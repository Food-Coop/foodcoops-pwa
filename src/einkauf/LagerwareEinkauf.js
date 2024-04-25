import React, { useState, useEffect } from 'react';
import { useTable, useSortBy } from 'react-table';
import { useApi } from '../ApiService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BTable from "react-bootstrap/Table";
import '../Table.css';

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
        
      } = useTable({ columns, data: produkt, }, useSortBy)

    const handleChange = (e, max, name) => {
      let value = e.target.value;

      if (value > max) {
        toast.info("Momentan sind leider nur " + max + " Stück " + name + " verfügbar.");
        e.target.value = max;
      }

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
                if (!data._embedded || data._embedded.produktRepresentationList.length === 0) {
                  return;
                } else {
                  setProdukt(data._embedded.produktRepresentationList);
                }
            } catch (error) {
                console.error('Error fetching produkt:', error);
            }
        };

        fetchProdukt();
    },[props.forceUpdate]);

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

    const content = () => {
      if (produkt.length === 0) {
        return null;
      } else {
        return (
          <div className="tableFixHead">
        <BTable striped bordered hover size="sm" {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th className="word-wrap" key={headerGroup.id + "HeaderLager"} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                      let id = "PreisIdLager" + row.index;
                      return(
                        <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Lager`} style={{color: row.original.lagerbestand.istLagerbestand === 0 ? NotAvailableColor : ''}} id={id} >{cell.render('Cell')}</td>
                      );
                    }else if(cell.column.Header === "genommene Menge"){
                      let id = "InputfieldLager" + row.index;
                      return(
                        <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Lager`}><input className='einkauf-inputfield-size lagerEinkauf-size' id={id} type="number" min="0" max={row.original.lagerbestand.istLagerbestand} onChange={(e) => handleChange(e, row.original.lagerbestand.istLagerbestand, row.original.name)} disabled={row.original.lagerbestand.istLagerbestand === 0}></input></td>
                      );
                    } else {
                      return <td className="word-wrap" key={`${row.original.id}-${cell.column.Header}Lager`} style={{color: row.original.lagerbestand.istLagerbestand === 0 ? NotAvailableColor : ''}} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                    }
                  })}
                </tr>
              )
            })}
          </tbody>
          </BTable>
          </div>
    );
  }}

  return (
    content()
  );
}