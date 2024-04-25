import { useExpanded, useTable, useSortBy } from "react-table";
import BTable from "react-bootstrap/Table";
import Button from 'react-bootstrap/Button';
import React from 'react';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import CustomTooltip from "../components/CustomToolTip";
import '../Table.css';

export function BestellungTable({ columns, data, skipPageReset }) {
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

    const setValuesToBestellungVorwoche = () => {
        for(let i = 0; i < data.length; i++){
            let inputfieldId = "Inputfield" + i;
            let bestellmenge = data[i].bestellmengeAlt;
            if(bestellmenge === null || bestellmenge === undefined){
                bestellmenge = '';
            }
            document.getElementById(inputfieldId).value = bestellmenge;
        }
        calculatePrice();
    }
    const [open, setOpen] = React.useState(false);

    const handleTooltipClose = () => {
      setOpen(false);
    };
  
    const handleTooltipOpen = () => {
      setOpen(true);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <ClickAwayListener onClickAway={handleTooltipClose}>
                <div >
                    <CustomTooltip onClose={handleTooltipClose}
                        open={open}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                        <React.Fragment>
                            <Typography color="inherit"><b>Hinweis</b></Typography>
                            Über "Bestellmenge Vorwoche laden" können Sie die Bestellmengen ihrer Bestellung aus der Vorwoche in die Eingabefelder "Bestellmenge" laden.
                        </React.Fragment>
                        }
                        placement="right" arrow>
                        <IconButton style={{margin: "0.5em 0 0.5em 0"}} onClick={handleTooltipOpen}>
                            <HelpOutlineIcon />
                        </IconButton>
                    </CustomTooltip>
                </div>
            </ClickAwayListener>
                <Button style={{margin: "0.5em 1em 0.5em 0"}} variant="primary" onClick={() => setValuesToBestellungVorwoche()}>Bestellmenge Vorwoche laden</Button>
            </div>
            <div className="tableFixHead">
            <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  if (column.Header === "ProduktID") {
                    // Hide the 'ProduktID' header
                    return null;
                  } else {
                    return <th className="word-wrap" key={headerGroup.id + "Header"} {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                            (row.original.hasOwnProperty("produkte") ? row.cells.slice(0, 2) : row.cells)
                                .map((cell) => {
                                    const props = cell.getCellProps();
                                    if(cell.column.Header === "ProduktID"){
                                        return null;
                                    } else if(cell.column.Header === "Bestellmenge"){
                                        let vorwoche = data[row.index].bestellmengeAlt;
                                        if(vorwoche === null || vorwoche === undefined){
                                            vorwoche = 0;
                                        }
                                        let id = "Inputfield" + row.index;
                                        return(
                                            <td className="word-wrap" key={row.index}><input placeholder={"Vorwoche: " + vorwoche} className="bestellung-inputfield-size" type="number" min="0" id={id} onChange={() => calculatePrice()} disabled={data[row.index].verfuegbarkeit === false}></input></td>
                                        );
                                    } else if(cell.column.Header === "Preis in €"){
                                        let id = "PreisId" + row.index;
                                        return(
                                            <td className="word-wrap" style={{color: data[row.index].verfuegbarkeit === false ? NotAvailableColor : ''}} key={row.index} {...props} id = {id}>{cell.render('Cell')}</td>
                                        );
                                    } else if(cell.column.Header === "aktuelle Bestellmenge" || cell.column.Header === "Bestellmenge (alle Mitglieder)"){
                                        return(
                                            <td className="word-wrap" style={{color: data[row.index].verfuegbarkeit === false ? NotAvailableColor : ''}} key={row.index}{...props} >{cell.render('Cell')}</td>
                                        );
                                    } else if(cell.column.Header === "Gebindegröße"){
                                        if(data[row.index].spezialfallBestelleinheit === true){
                                            return(
                                                <td className="word-wrap" style={{color: data[row.index].verfuegbarkeit === false ? NotAvailableColor : ''}} key={row.index}{...props} >{cell.render('Cell')} (Stück)</td>
                                            );
                                        } else {
                                            return(
                                                <td className="word-wrap" style={{color: data[row.index].verfuegbarkeit === false ? NotAvailableColor : ''}} key={row.index}{...props} >{cell.render('Cell')}</td>
                                            );
                                        }
                                    } else{
                                        return (
                                            <td className="word-wrap" style={{color: data[row.index].verfuegbarkeit === false ? NotAvailableColor : ''}} key={row.index} {...props}>{cell.render('Cell')}</td>
                                        );
                                    }
                                })}
                    </tr>
                )
            })}
            </tbody>
        </BTable>
        </div>
        </div>
    )
}