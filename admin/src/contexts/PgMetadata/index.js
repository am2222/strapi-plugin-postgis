import React, { createContext,useReducer } from 'react';

export const PgMetadataContext = createContext({});

//Initial State and Actions
export const initialState = {
    spatialColumns: [],
    spatialTables: {}
};

export const actions = {
    SET_SPATIAL_COLUMNS: "SET_SPATIAL_COLUMNS",
    SET_SPATIAL_TABLES: "SET_SPATIAL_TABLES",
};

//Reducer to Handle Actions
export const reducer = (state, action) => {
    switch (action.type) {
        case actions.SET_SPATIAL_COLUMNS:
            return {
                spatialColumns: action.value
            };
        case actions.SET_SPATIAL_TABLES: {
            return { spatialTables: action.value };
        }
        default:
            return state;
    }
};
export const PgMetadataProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = {state, dispatch}

    return (
        <PgMetadataContext.Provider value={value}>
            {children}
        </PgMetadataContext.Provider>
    );
};

export default PgMetadataContext;