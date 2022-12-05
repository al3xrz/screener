import "./App.css";
import Map from "./components/Map";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/hostid/:id" element={<Map />} />
      </Routes>
    </div>
  );
}

export default App;
