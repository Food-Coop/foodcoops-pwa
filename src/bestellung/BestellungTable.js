import {useExpanded, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";

export function BestellungTable({columns, data, skipPageReset}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: {expanded},
    } = useTable(
        {
            columns,
            data,
            getSubRows: row => row.produkte,
           autoResetPage: !skipPageReset,
            autoResetExpanded: !skipPageReset,
        },
        useExpanded
    )

    const calculatePrice = () => {
        let preis = 0;
        for(let i = 0; i < data.length; i++){
            let bestellId = "Inputfield" + i;
            let bestellmenge = document.getElementById(bestellId).value;
            let preisId = "PreisId" + i;
            preis += document.getElementById(preisId).innerText * bestellmenge;
        }
        preis = preis.toFixed(2);
        document.getElementById("preis").innerHTML = "Preis: " + preis + "€";
    }

    return (
        <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()}>
                            {column.render('Header')}
                        </th>
                    ))}
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
                                    if(cell.column.Header == "Kategorie"){
                                        let id = "KategorieId" + row.index;
                                        if(data[row.index].verfuegbarkeit == true){
                                            return(
                                                <td{...props} id = {id}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        }
                                        else{
                                            return(
                                                <td{...props} id = {id} style={{color:'grey'}}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        }
                                    }
                                    else if(cell.column.Header == "Produkt"){
                                        let id = "ProduktName" + row.index;
                                        if(data[row.index].verfuegbarkeit == true){
                                            return(
                                                <td{...props} id = {id}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        }
                                        else{
                                            return(
                                                <td{...props} id = {id} style={{color:'grey'}}>
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        }
                                    }
                                    else if(cell.column.Header == "Bestellmenge"){
                                        let id = "Inputfield" + row.index;
                                        let vorwoche = data[row.index].bestellmengeAlt;
                                        let woche = data[row.index].bestellmengeNeu;
                                        
                                        if(woche == undefined){
                                            if(vorwoche === undefined){
                                                vorwoche = 0;
                                            }
                                            if(data[row.index].verfuegbarkeit == true){
                                                vorwoche = parseFloat(vorwoche);
                                                vorwoche = vorwoche.toFixed(2);
                                                return(
                                                    <input type="text" placeholder={"Bestellung Vorwoche: " + vorwoche} id={id} onChange={() => calculatePrice()}></input>
                                                )
                                            }
                                            else{
                                                vorwoche = parseFloat(vorwoche);
                                                vorwoche = vorwoche.toFixed(2);
                                                return(
                                                    <input type="text" placeholder={"Bestellung Vorwoche: " + vorwoche} id={id} onChange={() => calculatePrice()} disabled></input>
                                                )
                                            }
                                        }
                                        else{
                                            if(data[row.index].verfuegbarkeit == true){
                                                woche = parseFloat(woche);
                                                woche = woche.toFixed(2);
                                                return(
                                                    <input type="text" placeholder={"Bestellung Aktuell: " + woche} id={id} onChange={() => calculatePrice()}></input>
                                                )
                                            }
                                            else{
                                                woche = parseFloat(woche);
                                                woche = woche.toFixed(2);
                                                return(
                                                    <input type="text" placeholder={"Bestellung Aktuell: " + woche} id={id} onChange={() => calculatePrice()} disabled></input>
                                                )
                                            }
                                        }
                                        
                                        
                                    }
                                    else if(cell.column.Header == "Preis"){
                                        let id = "PreisId" + row.index;
                                        if(data[row.index].verfuegbarkeit == true){
                                            return(
                                                <td{...props} id = {id}>
                                                    {cell.render('Cell')}
                                                </td>
                                            )
                                        }
                                        else{
                                            return(
                                                <td{...props} id = {id} style={{color:'grey'}}>
                                                    {cell.render('Cell')}
                                                </td>
                                            )
                                        }
                                    }
                                    else{
                                        if(data[row.index].verfuegbarkeit == true){
                                            return (
                                                <td {...props}>
                                                    {cell.render('Cell')}
                                                </td>
                                            )
                                        }
                                        else{
                                            return (
                                                <td {...props} style={{color:'grey'}}>
                                                    {cell.render('Cell')}
                                                </td>
                                            )
                                        }
                                    }
                                })}
                    </tr>
                )
            })}
            </tbody>
        </BTable>
    )


}
