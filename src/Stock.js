import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import BTable from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import {useExpanded, useTable} from 'react-table';
import Modal from 'react-bootstrap/Modal'

/**
 * Clone an object recursively. Subsequent changes to the original will not be changed in the clone and vice versa.
 * Does not support functions and object cycles (among other things) because it relies on JSON (de)-serialization.
 *
 * @param o original object
 * @returns {any} cloned object
 */
const deepClone = o => JSON.parse(JSON.stringify(o));

/**
 * Assign a value to a key in the target object.
 * Key can be a combination of multiple object keys separated by dots.
 *
 * For example: `merge("a.b.c", {a:{b:{c:false}}}, true)` returns `{a:{b:{c:true}}}`.
 *
 * @param {string} key
 * @param {{}} obj
 * @param {*} value
 * @returns {{}} obj
 */
function deepAssign(key, obj, value) {
    const accessors = key.split('.');
    const accessor = accessors.pop();
    for (const accessor of accessors) {
        obj = obj[accessor];
    }

    obj[accessor] = value;

    return obj;
}

function MyVerticallyCenteredModal(props) {
    const rowData = props.rowData || [];
    const [showModal, setShowModal] = React.useState(false);
    const [newData, setNewData] = React.useState({});

    React.useEffect(() => {
        setShowModal(props.show);
    }, [props.show])

    const close = () => {
        setShowModal(false);
        props.close();
        setNewData({});
    };

    const save = () => {
        for (const [accessor, {value}] of Object.entries(newData)) {
            props.updateMyData(props.rowId, accessor, value);
        }

        props.persist(props.rowId, newData);

        close();
    };

    const merged = {
        ...Object.fromEntries(rowData
            .filter(({value}) => value)
            .map(({column: {Header: name, id: accessor}, value}) => [accessor, {name, value}])),
        ...newData
    };

    return (
        <Modal
            show={showModal}
            onHide={close}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Produkt bearbeiten
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <form>
                    <table>
                        <tbody>
                        {Object.entries(merged)
                            .map(([accessor, {name, value}]) => <tr key={accessor}>
                                <td>
                                    <label>{name}:</label>
                                </td>
                                <td>
                                    <input
                                        name={name}
                                        value={value}
                                        onChange={function ({target: {value}}) {
                                            const changed = {};
                                            changed[accessor] = {name, value};
                                            return setNewData(prev => ({...prev, ...changed}));
                                        }}/>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </form>
            </Modal.Body>
            {props.children}
            <Modal.Footer>
                <Button onClick={close}>Änderungen verwerfen</Button>
                <Button onClick={save}>Änderungen übernehmen</Button>
            </Modal.Footer>
        </Modal>
    );
}

function Table({columns, data, updateMyData, skipPageReset, dispatchModal}) {
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
                            // canExpand is true for the kategorie header row
                            // make the kategorie name span multiple columns for these rows
                            (row.canExpand ? row.cells.slice(0, 2) : row.cells)
                                .map((cell, i) => {
                                    const props = cell.getCellProps();
                                    if (i === 1 && row.canExpand) {
                                        props.colSpan = row.cells.length - 1;
                                        props.style = {...props.style, fontWeight: "bold"};
                                    } else if (i !== 0) {
                                        props.onClick = () => dispatchModal("OPEN", cell, row);
                                        props.style = {...props.style, cursor: "pointer"};
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
                accessor: 'lagerbestand.istLagerbestand',
            },
            {
                Header: 'Soll Lagerbestand',
                accessor: 'lagerbestand.sollLagerbestand',
            },
            {
                Header: 'Einheit',
                accessor: 'lagerbestand.einheit.name',
            },
        ],
        []
    );

    const [data, setData] = React.useState(null);
    const [originalData, setOriginalData] = React.useState(data)
    const [skipPageReset, setSkipPageReset] = React.useState(false)

    // TODO: use something like https://github.com/rally25rs/react-use-timeout#useinterval or https://react-table.tanstack.com/docs/faq#how-can-i-use-the-table-state-to-fetch-new-data to update the data
    React.useEffect(
        () =>
            fetch("https://foodcoops-backend.herokuapp.com/kategorie")
                .then((r) => r.json())
                .then((r) => {
                        setOriginalData(deepClone(r));
                        setData(r._embedded.kategorieRepresentationList);
                    }
                ), []
    )

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
                deepAssign(columnId, old[kategorieId].produkte[produktId], value);

                return deepClone(old);
            }
        )
    }

    const persistProdukt = (rowId, patch) => {
        const [kategorieId, _, produktId] = rowId.split('').map(parseInt);
        const {produkte, id: kategorie} = data[kategorieId];
        const produkt = produkte[produktId];
        const changedData = {...deepClone(produkt), kategorie};
        for (const [accessor, {value}] of Object.entries(patch)) {
            deepAssign(accessor, changedData, value);
        }

        fetch("https://foodcoops-backend.herokuapp.com/produkt/" + produkt.id,{
            method:"PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(changedData),
        })
    };

    // After data chagnes, we turn the flag back off
    // so that if data actually changes when we're not
    // editing it, the page is reset
    React.useEffect(() => {
        setSkipPageReset(false)
    }, [data]);

    const modalReducer = (state, action) => {
        const {
            type,
            extra: [columnId, rowId],
            values: rowData
        } = action;
        switch (action.type) {
            case "OPEN":
                return {
                    rowData,
                    rowId,
                    show: true
                }
            case "CLOSE":
                return {
                    show: false
                }

        }
    }

    const [modalState, modalDispatch] = React.useReducer(modalReducer, {
        show: false
    });

    const dispatchModal = (type, cell, row) => {
        let extra = [undefined, undefined];
        let values = undefined;
        try {
            extra = [cell.column.id, row.id];
            values = row.cells;
        } catch (e) {

        }

        modalDispatch({
            type,
            extra,
            values
        })
    }

    if (data === null) {
        return (
            <div className="spinner-border" role="status" style={{margin: "5rem"}}>
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    return (
        <div>
            <div style={{overflowX: "auto", width: "100%"}}>
                <Table columns={columns}
                       data={data}
                       updateMyData={updateMyData}
                       skipPageReset={skipPageReset}
                       dispatchModal={dispatchModal}/>
            </div>

            <MyVerticallyCenteredModal
                show={modalState.show}
                close={() => dispatchModal("CLOSE")}
                updateMyData={updateMyData}
                persist={persistProdukt}
                rowId={modalState.rowId}
                rowData={modalState.rowData}>
            </MyVerticallyCenteredModal>
        </div>
    )
}
