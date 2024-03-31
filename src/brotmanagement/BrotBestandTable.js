import React from "react";
import { useExpanded, useTable, useSortBy } from "react-table";
import BTable from "react-bootstrap/Table";

export function BrotBestandTable({ columns, data, skipPageReset, dispatchModal }) {
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
            initialState: { sortBy: [{ id: 'name'}] },
        },
        useSortBy,
        useExpanded,
    );

    return (
        <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                {column.render('Header')}
                                <span>
                                    {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                                </span>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody  {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell, i) => {
                                const props = cell.getCellProps();
                                props.onClick = () => dispatchModal("EditBrotBestandModal", cell, row);
                                props.style = { ...props.style, cursor: "pointer" };
                                return (
                                    <td {...props}>
                                        {cell.column.id === 'verfuegbarkeit' ? (cell.value ? 'Ja' : 'Nein') : cell.render('Cell')}
                                    </td>
                                )
                            })}
                        </tr>
                    )
                })}
            </tbody>
        </BTable>
    )
}