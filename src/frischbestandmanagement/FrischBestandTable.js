import {useExpanded, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";

export function FrischBestandTable({columns, data, skipPageReset, dispatchModal}) {
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
                            row.cells.map((cell, i) => {
                                    const props = cell.getCellProps();
                                    props.onClick = () => dispatchModal("EditFrischBestandModal", cell, row);
                                    props.style = {...props.style, cursor: "pointer"};
                                    return (
                                        <td {...props}>
                                            {cell.column.id === 'verfuegbarkeit' ? (cell.value ? 'Ja' : 'Nein') : cell.render('Cell')}
                                        </td>
                                    )
                                })
                        }
                    </tr>
                )
            })}
            </tbody>
        </BTable>
    )
}