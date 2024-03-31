import {useExpanded, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";

export function BestellungTable({columns, data, skipPageReset}) {
    const NotAvailableColor = '#D3D3D3';
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
                {headerGroup.headers.map((column) => {
                  if (column.Header === "ProduktID") {
                    // Hide the 'ProduktID' header
                    return null;
                  } else {
                    return <th {...column.getHeaderProps()}>{column.render("Header")}</th>;
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
                                    if(cell.column.Header == "ProduktID"){
                                            return(
                                                <span id={`ProduktId${row.index}`} style={{ display: "none" }}>
                                                    {cell.render("Cell")}
                                              </span>
                                            );
                                    }
                                    else if(cell.column.Header == "Kategorie"){
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
                                                <td{...props} id = {id} style={{color:NotAvailableColor}}>
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
                                                <td{...props} id = {id} style={{color:NotAvailableColor}}>
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
                                                    <td><input type="number" min="0" placeholder={"Bestellung Vorwoche: " + vorwoche} id={id} onChange={() => calculatePrice()}></input></td>
                                                )
                                            }
                                            else{
                                                vorwoche = parseFloat(vorwoche);
                                                vorwoche = vorwoche.toFixed(2);
                                                return(
                                                    <td><input type="number" min="0" placeholder={"Bestellung Vorwoche: " + vorwoche} id={id} onChange={() => calculatePrice()} style={{ color: NotAvailableColor}} disabled></input></td>
                                                )
                                            }
                                        }
                                        else{
                                            if(data[row.index].verfuegbarkeit == true){
                                                woche = parseFloat(woche);
                                                woche = woche.toFixed(2);
                                                return(
                                                    <td><input type="number" min="0" placeholder={"Bestellung Aktuell: " + woche} id={id} onChange={() => calculatePrice()}></input></td>
                                                )
                                            }
                                            else{
                                                woche = parseFloat(woche);
                                                woche = woche.toFixed(2);
                                                return(
                                                    <td><input type="number" min="0" placeholder={"Bestellung Aktuell: " + woche} id={id} onChange={() => calculatePrice()} style={{ color: NotAvailableColor}} disabled></input></td>
                                                )
                                            }
                                        }
                                        
                                        
                                    }
                                    else if(cell.column.Header == "Preis in €"){
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
                                                <td{...props} id = {id} style={{color:NotAvailableColor}}>
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
                                                <td {...props} style={{color:NotAvailableColor}}>
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
