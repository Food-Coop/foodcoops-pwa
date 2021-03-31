import React from "react";
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css';

import BTable from 'react-bootstrap/Table';

import {useExpanded, useTable} from 'react-table'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

function reshape(data) {
    for (const kategorie of data) {
        kategorie.subRows = kategorie.produktResources;
    }

    return data;
}

function Table({columns, data}) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: {expanded},
    } = useTable(
        {
            columns: columns,
            data,
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
                {rows.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {
                                // canExpand is true for the kategorie header row
                                // make the kategorie name span multiple columns for these rows
                                (row.canExpand ? row.cells.slice(0, 2) : row.cells)
                                    .map((cell, i) => {
                                        const props = cell.getCellProps();
                                        if (i === 1 && row.canExpand) {
                                            props.colSpan = row.cells.length - 1;
                                            props.style = props.style || {fontWeight: "bold"};
                                        }
                                        return (
                                            <td {...props}>
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

export function Stock() {
    const columns = React.useMemo(
        () => [
            {
                id: 'expander',
                Header: ({getToggleAllRowsExpandedProps, isAllRowsExpanded}) => (
                    <span {...getToggleAllRowsExpandedProps()}>
                {isAllRowsExpanded ? 'Icon' : 'Icon'}
              </span>
                ),
                accessor: 'icon',
                Cell: ({cell, row}) => {
                    return row.canExpand ? (
                        <span
                            {...row.getToggleRowExpandedProps({
                                style: {
                                    paddingLeft: `${row.depth * 2}rem`,
                                }
                            })}
                        >

                <div {
                         ...{
                             style: {
                                 height: "1.5em",
                                 backgroundImage: "url(" + cell.value + ")",
                                 backgroundSize: "contain",
                                 backgroundRepeat: "no-repeat",
                                 backgroundPosition: "center"
                             }
                         }
                     } />
                </span>
                    ) : null;
                }
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Ist Lagerbestand',
                accessor: 'lagerbestandResource.istLagerbestand',
            },
            {
                Header: 'Soll Lagerbestand',
                accessor: 'lagerbestandResource.sollLagerbestand',
            },
            {
                Header: 'Einheit',
                accessor: 'lagerbestandResource.einheit',
            },
        ],
        []
    );

    const [stockData, setStockData] = React.useState([]);

    // TODO: use something like https://github.com/rally25rs/react-use-timeout#useinterval or https://react-table.tanstack.com/docs/faq#how-can-i-use-the-table-state-to-fetch-new-data to update the data
    React.useEffect(
        () =>
            fetch("stock.json")
                .then((r) => r.json())
                .then((r) => setStockData(reshape(r))
                ), []
    )

    const data = React.useMemo(() => stockData, [stockData]);

    return (
        <div>
            <Table columns={columns} data={data}/>
        </div>
    )
}
