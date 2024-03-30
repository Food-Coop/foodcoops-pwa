import {useExpanded, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import React, {useState, useEffect} from "react";
import NumberFormatComponent from "../logic/NumberFormatComponent";

export function BrotTable( {columns, data, skipPageReset, onPriceChange}) {
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
        },
        useExpanded
    )
    const [totalBrotPrice, setTotalBrotPrice] = useState(0);
    const [brotBestellungPrice, setBrotBestellungPrice] = useState([]);

    useEffect(() => {
        if (onPriceChange) {
          onPriceChange(totalBrotPrice);
        }
      }, [totalBrotPrice]);

    const calculatePrice = (e, orderData, index) => {
        console.log("Length"+brotBestellungPrice.length);
        const quantity = parseInt(e.target.value, 10);
    
        const itemPrice = quantity * orderData.preis;
    
        const updatedBrotBestellung = [...brotBestellungPrice];
        updatedBrotBestellung[index] = itemPrice;
        setBrotBestellungPrice(updatedBrotBestellung);
    
        const total = updatedBrotBestellung.reduce((acc, curr) => acc + (curr || 0), 0);
        setTotalBrotPrice(total);
    };

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
                            (row.original.hasOwnProperty("produkte") ? row.cells.slice(0, 2) : row.cells)
                                .map((cell, i) => {
                                    const props = cell.getCellProps();
                                    if(cell.column.Header == "BrotID"){
                                        return(
                                            <span id={`ProduktId${row.index}`} style={{ display: "none" }}>
                                                {cell.render("Cell")}
                                          </span>
                                        );
                                    }
                                    else if(cell.column.Header == "Brotname"){
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
                                                return(
                                                    <input type="number" min="0" placeholder={"Bestellung Vorwoche: " + vorwoche} id={id} onChange={e => calculatePrice(e, data[row.index], row.index)}></input>
                                                )
                                            }
                                            else{
                                                return(
                                                    <input type="number" min="0" placeholder={"Bestellung Vorwoche: " + vorwoche} id={id} onChange={e => calculatePrice(e, data[row.index], row.index)} disabled></input>
                                                )
                                            }
                                        }
                                        else{
                                            if(data[row.index].verfuegbarkeit == true){
                                                return(
                                                    <input type="number" min="0" placeholder={"Bestellung Aktuell: " + woche} id={id} onChange={e => calculatePrice(e, data[row.index], row.index)}></input>
                                                )
                                            }
                                            else{
                                                return(
                                                    <input type="number" min="0" placeholder={"Bestellung Aktuell: " + woche} id={id} onChange={e => calculatePrice(e, data[row.index], row.index)} disabled></input>
                                                )
                                            }
                                        }
                                    }
                                    else if(cell.column.Header == "Preis in €"){
                                        let id = "PreisId" + row.index;
                                        if(data[row.index].verfuegbarkeit == true){
                                            return(
                                                <td{...props} id = {id}>
                                                    <NumberFormatComponent value={cell.value}/>
                                                </td>
                                            )
                                        }
                                        else{
                                            return(
                                                <td{...props} id = {id} style={{color:'grey'}}>
                                                    <NumberFormatComponent value={cell.value}/>
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