import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {LagerModal} from "./LagerModal";
import {LagerTable} from "./LagerTable";

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

export function Lager() {
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
            fetch("https://foodcoops-backend.herokuapp.com/kategorien")
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
                <LagerTable
                    columns={columns}
                    data={data}
                    updateMyData={updateMyData}
                    skipPageReset={skipPageReset}
                    dispatchModal={dispatchModal}/>
            </div>

            <LagerModal
                show={modalState.show}
                close={() => dispatchModal("CLOSE")}
                updateMyData={updateMyData}
                persist={persistProdukt}
                rowId={modalState.rowId}
                rowData={modalState.rowData}/>
        </div>
    )
}