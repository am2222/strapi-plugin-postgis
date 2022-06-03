import React, { useState, useEffect } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useIntl } from 'react-intl';
import * as L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import ResizeObserver from "resize-observer-polyfill";
import { useFetchPgMetadata } from "../../hooks";
import "./leaflet.css";
const MainMap = () => {

    useEffect(() => {

        let map = L.map("map", {
            center: [66.51555389267186, -98.98946422681475],
            zoom: 4,
            maxZoom: 22,
        });


        let mapDiv = document.getElementById("map");
        let resizeObserver = new ResizeObserver(() => {
            map.invalidateSize();
        });
        resizeObserver.observe(mapDiv);

        let osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        let osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        let osm = L.tileLayer(osmUrl, { maxZoom: 18, attribution: osmAttrib });
        L.control.layers({
            'OSM': osm.addTo(map),
            "Google": L.tileLayer('http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
                attribution: 'google'
            })
        }, undefined, { position: 'topright', collapsed: false }).addTo(map);


        return () => {
            //   resizeObserver && resizeObserver.unobserve(mapDiv);

        };
    }, [])

    return (
        <div id="map" style={{ height: '100%'  }}></div>
    );
};


export default MainMap;