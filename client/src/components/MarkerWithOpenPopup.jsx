import { Marker } from "react-leaflet";
import React from "react";
import { useRef, useEffect } from "react";

const MarkerWithOpenPopup = React.forwardRef((props, ref) => {
  const markerRef = useRef();

  useEffect(() => {
    if (!markerRef.current) return;
    markerRef.current.openPopup();
  }, []);

  return <Marker ref={markerRef} {...props} />;
});

export default MarkerWithOpenPopup;
