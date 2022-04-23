import {useExpanded, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";
import {Bestellung} from "./Bestellung";

export function BestellungTable({columns, data, updateMyData, skipPageReset, dispatchModal}) {
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
            //initialState: { hiddenColumns: ['id'] },
            // show produkte as sub rows
            getSubRows: row => row.produkte,
            // use the skipPageReset option to disable page resetting temporarily
            autoResetPage: !skipPageReset,
            // useExpanded resets the expanded state of all rows when data changes
            autoResetExpanded: !skipPageReset,
            // updateMyData isn't part of the API, but
            // anything we put into these options will
            // automatically be available on the instance.
            // That way we can call this function from our
            // cell renderer!
            updateMyData,
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
                                    if(cell.column.Header == "ProduktID"){
                                        let id = "ProduktId" + row.index;
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
                                        if(vorwoche === undefined){
                                            vorwoche = 0;
                                        }
                                        if(data[row.index].verfuegbarkeit == true){
                                            return(
                                                <input type="text" placeholder={"Vorwoche: " + vorwoche} id={id} onChange={() => calculatePrice()}></input>
                                            )
                                        }
                                        else{
                                            return(
                                                <input type="text" placeholder={"Vorwoche: " + vorwoche} id={id} onChange={() => calculatePrice()} disabled></input>
                                            )
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
