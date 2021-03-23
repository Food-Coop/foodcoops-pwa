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

    const d = [
        {
            "firstName": "finding",
            "lastName": "suggestion",
            "age": 4,
            "visits": 77,
            "progress": 16,
            "status": "complicated",
            "subRows": [
                {
                    "firstName": "design",
                    "lastName": "afterthought",
                    "age": 19,
                    "visits": 73,
                    "progress": 17,
                    "status": "complicated"
                }
            ]
        }
    ];


    return data;
}

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state: { expanded },
    } = useTable(
        {
            columns: columns,
            data,
        },
        useExpanded // Use the useExpanded plugin hook
    )

  // Render the UI for your table
  return (<>
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
          <pre>
      <code>{JSON.stringify({ expanded: expanded }, null, 2)}</code>
    </pre>
          <pre>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre></>
  )
}

export function Stock() {
  const columns = React.useMemo(
    () => [
      //   { // https://github.com/tannerlinsley/react-table/blob/master/examples/expanding/src/App.js
      //     // https://react-table.tanstack.com/docs/examples/expanding
      // // Build our expander column
      //       id: 'expander', // Make sure it has an ID
      // Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
      //     <span {...getToggleAllRowsExpandedProps()}>
      //       {isAllRowsExpanded ? '👇' : '👉'}
      //     </span>
      // ),
      // Cell: ({ row }) =>
      //     // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
      //     // to build the toggle for expanding a row
      //     row.canExpand ? (
      //         <span
      //             {...row.getToggleRowExpandedProps({
      //               style: {
      //                 // We can even use the row.depth property
      //                 // and paddingLeft to indicate the depth
      //                 // of the row
      //                 paddingLeft: `${row.depth * 2}rem`,
      //               },
      //             })}
      //         >
      //         {row.isExpanded ? '👇' : '👉'}
      //       </span>
      //     ) : null,
      //   },
      {
      id: 'expander', // Make sure it has an ID
          Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
              <span {...getToggleAllRowsExpandedProps()}>
                {isAllRowsExpanded ? 'Icon' : 'Icon'}
              </span>
          ),
        accessor: 'icon',
          Cell: ({ cell,row }) => {
              // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
              // to build the toggle for expanding a row
              return row.canExpand ? (
                  <span
                      {...row.getToggleRowExpandedProps({
                          style: {
                              // We can even use the row.depth property
                              // and paddingLeft to indicate the depth
                              // of the row
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
()=>
    fetch("stock.json")
        .then((r) => r.json())
        .then((r) => setStockData(reshape(r))
        ),[]
)

  const data = React.useMemo(() => stockData, [stockData]);

  return (
    <div>
      <Table columns={columns} data={data} />
    </div>
  )
}
