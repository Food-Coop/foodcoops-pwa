import {useExpanded, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";
import '../Table.css';

export function DeadlineTable({ columns, data, skipPageReset }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { expanded },
    } = useTable(
        {
            columns,
            data,
            getSubRows: row => row.produkte,
            autoResetPage: !skipPageReset,
            autoResetExpanded: !skipPageReset,
        },
        useExpanded
    );

    return (
        <BTable striped bordered hover size="sm" {...getTableProps()}>
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr className="word-wrap" {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell, i) => {
                                const props = cell.getCellProps();
                                const content =
                                    cell.column.id === 'time'
                                        ? formatTime(cell.value)
                                        : cell.render('Cell');
                                return <td className="word-wrap" {...props}>{content}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </BTable>
    );
}

function formatTime(time) {
    const parsedTime = new Date(`2000-01-01T${time}`);
    const formattedTime = parsedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return formattedTime;
}
