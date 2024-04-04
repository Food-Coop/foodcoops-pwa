import { useExpanded, useTable, useSortBy } from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";

export function BrotTable({ columns, data, skipPageReset }) {
    const NotAvailableColor = '#D3D3D3';
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data,
            getSubRows: row => row.produkte,
            autoResetPage: !skipPageReset,
            autoResetExpanded: !skipPageReset,
            initialState: { sortBy: [{ id: 'name' }] },
        },
        useSortBy, 
        useExpanded
    );

    const calculatePrice = () => {
        let preis = 0;
        for(let i = 0; i < data.length; i++){
            let bestellId = "Inputfield" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            let preisId = "PreisId" + i;
            preis += document.getElementById(preisId).innerText.replace(',', '.') * bestellmenge;
        }
        document.getElementById("preis").innerHTML = "Preis: " + preis.toFixed(2).replace('.', ',') + " €";
    }

    return (
        <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
               <tr {...headerGroup.getHeaderGroupProps()}>
               {headerGroup.headers.map((column) => {
                 if (column.Header === "BrotID") {
                   // Hide the 'BrotID' header
                   return null;
                 } else {
                   return <th key={headerGroup.id + "Header"} {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render("Header")}
                        <span>
                            {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                        </span>
                    </th>;
                 }
               })}
             </tr>
            ))}
            </thead>
            <tbody  {...getTableBodyProps()}>
            {rows.map(row => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {
                            // canExpand is true for the kategorien header row
                            // make the kategorien name span multiple columns for these rows
                            (row.original.hasOwnProperty("produkte") ? row.cells.slice(0, 2) : row.cells)
                                .map((cell, i) => {
                                    const props = cell.getCellProps();
                                    if(cell.column.Header === "BrotID"){
                                        return null;
                                    } else if(cell.column.Header === "Bestellmenge"){
                                        let id = "Inputfield" + row.index;
                                        return(
                                            <td style={{width: "17em"}} key={row.index}><input type="number" min="0" id={id} onChange={() => calculatePrice()} disabled={data[row.index].verfuegbarkeit === false}></input></td>
                                        );
                                    } else if(cell.column.Header === "Preis in €"){
                                        let id = "PreisId" + row.index;
                                        return(
                                            <td style={{color: data[row.index].verfuegbarkeit === false ? NotAvailableColor : ''}} key={row.index}{...props} id = {id}>{cell.render('Cell')}</td>
                                        );
                                    } else if(cell.column.Header === "aktuelle eigene Bestellung" || cell.column.Header === "Gewicht in g"){
                                        return(
                                            <td style={{color: data[row.index].verfuegbarkeit === false ? NotAvailableColor : '', width: "15em"}} key={row.index}{...props} >{cell.render('Cell')}</td>
                                        );
                                    } else{
                                        return (
                                            <td style={{color: data[row.index].verfuegbarkeit === false ? NotAvailableColor : ''}} key={row.index} {...props}>{cell.render('Cell')}</td>
                                        );
                                    }
                                })}
                    </tr>
                )
            })}
            </tbody>
        </BTable>
    )
}