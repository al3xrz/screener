document.addEventListener("DOMContentLoaded", () => {
  const map = L.map("map").setView([51.505, -0.09], 13);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  let iconMarker = L.ExtraMarkers.icon({
    markerColor: "red",
    shape: "square",
    prefix: "fa",
    innerHTML: `<div style="padding-top:4px">
                      <b><div style="color:white;font-size:0.7rem;margin-top:5px">${42}</div></b>
                 <div>`,
  });

  
  
  L.marker([51.5, -0.09], {
    icon: iconMarker,
    riseOnHover: true,
  })
    .addTo(map)
    .bindPopup("<b>Hello world!</b><br>I am a popup.")
    .openPopup();

  
});
