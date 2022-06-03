

import { useCallback, useContext, useEffect, useState, useMemo, useReducer, useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance'

import getRequestUrl from '../../utils/getRequestURL';
import { reducer, initialState, actions } from '../../contexts/PgMetadata'
const useFetchPgMetadata = () => {
    const [metadataState, dispatch] = useReducer(reducer, initialState);
    const [spatialTables, setTables] = useState({})
    const getData = useCallback(
        async (source) => {
            try {
                const endPoint = getRequestUrl(`pgmetadata`);

                const responce = await axiosInstance.get(endPoint, { cancelToken: source.token });
                dispatch({
                    type: actions.SET_SPATIAL_TABLES,
                    value: responce.data.results.spatialTables,
                });
                dispatch({
                    type: actions.SET_SPATIAL_COLUMNS,
                    value: responce.data.results.spatialColumns,
                });
                setTables(responce.data.results.spatialTables);
            } catch (error) {
                if (axios.isCancel(error)) {
                    return;
                }
            }
        },
        []
    );

    useEffect(() => {
    
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        getData(source);

        return () => {
            source.cancel('Operation canceled by the user.');
        };
    }, [getData]);

    return {
        spatialTables,
    };
};

export default useFetchPgMetadata;