import {useExpanded, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";

export function DeadlineTable({columns, data, updateMyData, skipPageReset, dispatchModal}) {
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

    const getLastDeadline = () => {
        let lastDate = data[0].datum;
        let row = 0;
        for(let i = 0; i < data.length; i++){
            if(data[i].datum > lastDate){
                lastDate = data[i].datum;
                row = i;
            }
            
        }
        return row;
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
                              row.cells
                                .map((cell, i) => {
                                    const props = cell.getCellProps();
                                    return(
                                        <td{...props}>
                                            {cell.render('Cell')}
                                        </td>
                                    );
                                })
                        }
                    </tr>
                )
            })}
            </tbody>
        </BTable>
    )


}
