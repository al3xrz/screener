import React from "react";
import { useEffect } from "react";
import { Marker, useMap, Popup } from "react-leaflet";
import MarkerWithOpenPopup from "./MarkerWithOpenPopup";
import "leaflet/dist/leaflet.css";
import "leaflet-extra-markers";
import "font-awesome/css/font-awesome.css";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import { getIcon } from "../helpers/markerUtils";
import PopupContent from "./PopupContent";

export default function Markers(props) {
  const map = useMap();

  const markers = props.complexes.map((complex) => {
    if (complex.hostid === props.hostid) {
      return (
        <MarkerWithOpenPopup
          position={[
            complex.inventory.location_lat,
            complex.inventory.location_lon,
          ]}
          icon={getIcon(complex)}
          key={complex.hostid}
        >
          <Popup>
            <PopupContent complex={complex} />
          </Popup>
        </MarkerWithOpenPopup>
      );
    }
    return (
      <Marker
        position={[
          complex.inventory.location_lat,
          complex.inventory.location_lon,
        ]}
        icon={getIcon(complex)}
        key={complex.hostid}
      ></Marker>
    );
  });

  useEffect(() => {
    if (props.complexes.length !== 0) {
      console.log(props.hostid);
      const selected = props.complexes.find(
        (complex) => complex.hostid === props.hostid
      );
      map.setView(
        [selected.inventory.location_lat, selected.inventory.location_lon],
        14
      );
    }
  }, [map, props.complexes, props.hostid]);

  return markers;
}
