import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-extra-markers";
import "font-awesome/css/font-awesome.css";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import { useEffect, useState, useRef } from "react";
import Markers from "./Markers";
import axios from "axios";

export default function Map(props) {
  // const apiURI = "http://127.0.0.1:5001";
  const apiURI = "";


  const [complexes, setComplexes] = useState([]);
  const [currentHostID, setCurrentHostID] = useState(0);
  let trigger = useRef(false);

  useEffect(() => {
    if (trigger.current) return;
    axios.get(apiURI + "/api/state").then((response) => {
      setComplexes(response.data);
      console.log("Markers ready");
      axios.get(apiURI + "/api/state/hostid/current").then((response) => {
        console.log(response.data.hostid);
        setCurrentHostID(response.data.hostid)
      });
    });
    trigger.current = true;
  }, []);

  return (
    <MapContainer
      center={[42.65, 48.3]}
      zoom={9}
      scrollWheelZoom={true}
      attributionControl={false}
    >
      <TileLayer url="http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1.1" />
      <Markers complexes={complexes} hostid={currentHostID} />
    </MapContainer>
  );
}
