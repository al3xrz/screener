import L from "leaflet";

export function getIcon(complex) {
  return L.ExtraMarkers.icon({
    markerColor: iconMarkerColor(complex),
    shape: "square",
    prefix: "fa",
    innerHTML: `<div style="padding-top:4px">
                        <b><div style="color:white;font-size:0.7rem;margin-top:5px">${complex.violations}</div></b>
                   <div>`,
  });
}

export function iconMarkerColor(complex) {
  let markerColor = "green";
  if (complex.priority) {
    switch (complex.priority) {
      case 0:
        markerColor = "green";
        break;
      case 1:
        markerColor = "cyan";
        break;
      case 2:
        markerColor = "yellow";
        break;
      case 3:
        markerColor = "orange";
        break;
      case 4:
        markerColor = "orange-dark";
        break;
      case 5:
        markerColor = "red";
        break;
    }
  }

  return markerColor;
}
