import {useExpanded, useTable} from "react-table";
import BTable from "react-bootstrap/Table";
import React from "react";
import { EditFrischBestandModal } from "./EditFrischBestandModal";



export function FrischBestandTable({columns, data, updateMyData, skipPageReset, dispatchModal}) {
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
                                    if(data[row.index].verfuegbarkeit == true){
                                        data[row.index].verfuegbarkeit = 1;
                                    }
                                    else{
                                        data[row.index].verfuegbarkeit = 0;
                                    }
                                    return (
                                        <td {...props}>
                                            {cell.render('Cell')}
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

