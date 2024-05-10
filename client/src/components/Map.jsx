import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "leaflet-extra-markers";
import "font-awesome/css/font-awesome.css";
import "leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css";
import Markers from "./Markers";
import axios from "axios";

export default function Map(props) {
  // const apiURI = "http://127.0.0.1:5002";
  const apiURI = "";

  const [complexes, setComplexes] = useState([]);
  const params = useParams();
  console.log('Selected host params:', params);
  let trigger = useRef(false);

  useEffect(() => {
    if (trigger.current) return;
    axios
      .get(apiURI + `/api/state/id/${params.id}`)
      .then((response) => {
        setComplexes(response.data);
        console.log("complexes in Map", response.data)
        console.log("Markers ready");
      })
      .catch((error) => {
        console.log("Axios error", error);
      });
    trigger.current = true;
  }, [params.id]);

  return (
    <MapContainer
      center={[42.65, 48.3]}
      zoom={9}
      scrollWheelZoom={true}
      attributionControl={false}
    >
      <TileLayer url="http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1.1" />
      <Markers complexes={complexes} hostid={params.id} />
    </MapContainer>
  );
}
