import {useExpanded, useTable, useSortBy} from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";
import {EditProduktModal} from "./EditProduktModal";
import {EditKategorieModal} from "./EditKategorieModal";
import '../Table.css';

export function LagerTable({columns, data, skipPageReset, dispatchModal}) {
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
            initialState: { sortBy: [{ id: 'kategorie.name'}] },
        },
        useSortBy,
        useExpanded
    )

    return (
        <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
            {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                        <th class="word-wrap" {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {
                            // canExpand is true for the kategorien header row
                            // make the kategorien name span multiple columns for these rows
                            row.cells.map((cell, i) => {
                                    const props = cell.getCellProps();
                                    if (i === 1 && row.original.hasOwnProperty("produkte")) {
                                        props.colSpan = row.cells.length - 1;
                                        props.style = {...props.style, fontWeight: "bold", cursor: "pointer"};
                                        props.onClick = () => dispatchModal("EditKategorieModal", cell, row);
                                    } else {
                                        props.onClick = () => dispatchModal("EditProduktModal", cell, row);
                                        props.style = {...props.style, cursor: "pointer"};

                                    }

                                    return (
                                        <td class="word-wrap" {...props}>
                                            {cell.render('Cell')}
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
