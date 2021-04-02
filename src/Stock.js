import React from "react";
import styled from 'styled-components'
import 'bootstrap/dist/css/bootstrap.min.css';

import BTable from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row'

import {useExpanded, useTable} from 'react-table'

const deepClone = o => JSON.parse(JSON.stringify(o));

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

      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`

const CustomCell = (cellData) => {
    const {value, cell: {column: {id: columnId}}} = cellData;
    let cell = ({value}) => String(value);
    if (columnId === "lagerbestand.istLagerbestand" || columnId === "lagerbestand.sollLagerbestand") {
        cell = EditableCell;
    }

    if (columnId === "lagerbestand.einheit.name") {
        cell = DropDownCell;
    }

    return cell(cellData);
}

// Create an editable cell renderer
const DropDownCell = ({cell: {column: {id: columnId}}, row: {id: rowId}, updateMyData, value: initialValue}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState([initialValue]);

    React.useEffect(() => {
        setValue([initialValue])
    }, [initialValue]);

    const change = (e) => {
        const value = e.target.value;
        updateMyData(rowId, columnId, value)
    }

    return (
        <div>
            <select onChange={change}>
                {value.map((item, i) => <option key={i} value={item}>{item}</option>)}
            </select>
        </div>
    );
}

// Create an editable cell renderer
const EditableCell = ({cell: {column: {id: columnId}}, row: {id: rowId}, updateMyData, value: initialValue}) => {
    // We need to keep and update the state of the cell normally
    const [value, setValue] = React.useState(initialValue)

    const onChange = e => {
        setValue(e.target.value)
    }

    // We'll only update the external data when the input is blurred
    const onBlur = () => {
        console.log("onBlur", rowId, columnId);
        updateMyData(rowId, columnId, value)
    }

    // If the initialValue is changed external, sync it up with our state
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    return <input value={value} onChange={onChange} onBlur={onBlur} />
}

function reshape(data) {
    for (const kategorie of data._embedded.kategorieRepresentationList) {
        console.log(kategorie);
        kategorie.subRows = kategorie.produkte;
    }

    return data;
}

function Table({columns, data, updateMyData, skipPageReset}) {
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
            // use the skipPageReset option to disable page resetting temporarily
            autoResetPage: !skipPageReset,
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
                Cell: CustomCell,
            },
            {
                Header: 'Ist Lagerbestand',
                accessor: 'lagerbestand.istLagerbestand',
                Cell: CustomCell,
            },
            {
                Header: 'Soll Lagerbestand',
                accessor: 'lagerbestand.sollLagerbestand',
                Cell: CustomCell,
            },
            {
                Header: 'Einheit',
                accessor: 'lagerbestand.einheit.name',
                Cell: CustomCell,
            },
        ],
        []
    );

    const [data, setData] = React.useState([]);
    const [originalData, setOriginalData] = React.useState(data)
    const [skipPageReset, setSkipPageReset] = React.useState(false)

    // TODO: use something like https://github.com/rally25rs/react-use-timeout#useinterval or https://react-table.tanstack.com/docs/faq#how-can-i-use-the-table-state-to-fetch-new-data to update the data
    React.useEffect(
        () =>
            fetch("https://foodcoops-backend.herokuapp.com/kategorie")
                .then((r) => r.json())
                .then((r) => {
                        console.table(reshape(r));
                        setOriginalData(reshape(deepClone(r)));
                        setData(reshape(r)._embedded.kategorieRepresentationList);
                    }
                ), []
    )

    // We need to keep the table from resetting the pageIndex when we
    // Update data. So we can keep track of that flag with a ref.

    // When our cell renderer calls updateMyData, we'll use
    // the rowIndex, columnId and new value to update the
    // original data
    const updateMyData = (rowId, columnId, value) => {
        // We also turn on the flag to not reset the page
        setSkipPageReset(true)
        setData(old => {
            const [kategorieId, _, produktId] = rowId.split('').map(parseInt);
            if (produktId === undefined) {
                return old;
            }

            // walk the old data object using the accessor of the table columns
            const accessors = columnId.split('.');
            const accessor = accessors.pop();
            let obj = old[kategorieId].subRows[produktId];
            for (const accessor of accessors) {
                obj = obj[accessor];
            }

            obj[accessor] = value;

            return old;
                // return old.map((row, index) => {
                //     if (index === kategorieId) {
                //         console.log(kategorieId, produktId, row[kategorieId], old[kategorieId]);
                //         return {
                //             ...old[rowId],
                //             [columnId]: value,
                //         }
                //     }
                //     return row
                // });
            }
        )
    }

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    React.useEffect(() => {
        setSkipPageReset(false)
    }, [data]);

    // Let's add a data resetter/randomizer to help
    // illustrate that flow...
    const resetData = () => setData(originalData);

    try {
        console.table({original:originalData[0].subRows, data:data[0].subRows});
    } catch (e) {
        console.log("error", originalData, data);
    }

    const save = () => {
        console.table(data);
    };

    return (
        <div>
            <Row style={{margin:0, padding:"0.5em", paddingTop: "1em", paddingBottom: "1em"}}>
                <Button onClick={save}>save</Button>
            </Row>
            <Table columns={columns}
                   data={data}
                   updateMyData={updateMyData}
                   skipPageReset={skipPageReset}/>
        </div>
    )
}
