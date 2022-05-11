import {useExpanded, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";
import {Gebindemanagement} from "./Gebindemanagement";

export function GebindemanagementTable({columns, data, updateMyData, skipPageReset}) {
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
                            row.cells
                                .map((cell, i) => {
                                    const props = cell.getCellProps();
                                    if(cell.column.Header == "Preis") {
                                        return (
                                            <td {...props}>
                                                {cell.render('Cell')}€
                                            </td>
                                        )
                                    }
                                    else if(cell.column.Header == "Bestellmenge"){
                                        data[row.index].bestellmenge = parseFloat(data[row.index].bestellmenge);
                                        data[row.index].bestellmenge = data[row.index].bestellmenge.toFixed(2);
                                        return (
                                            <td {...props}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    }
                                    else{
                                        return (
                                            <td {...props}>
                                                {cell.render('Cell')}
                                            </td>
                                        )
                                    }

                                })}
                    </tr>
                )
            })}
            </tbody>
        </BTable>
    )


}
