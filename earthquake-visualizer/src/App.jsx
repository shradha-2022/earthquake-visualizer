import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";


export default function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minMag, setMinMag] = useState(0);

  // prevent multiple map initializations
  const mapRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
      );
      if (!res.ok) throw new Error("Failed to fetch data");
      const data = await res.json();
      setEarthquakes(data.features);
    } catch (err) {
      setError("⚠️ Unable to load earthquake data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getColor = (depth) => {
    return depth > 300 ? "#e63946" : depth > 70 ? "#ffba08" : "#2a9d8f";
  };

  const getRadius = (magnitude) => Math.max(magnitude * 3, 4);

  return (
    <div className="app-container">
      <header className="app-header">
        🌍 Earthquake Visualizer
        <span className="last-update">{new Date().toLocaleTimeString()}</span>
      </header>

      {loading && <div className="loader">Loading earthquake data...</div>}
      {error && <div className="error">{error}</div>}

      {/* Single clean map instance */}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={8}
        worldCopyJump={false}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: "100vh", width: "100%" }}
      >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {earthquakes
          .filter((eq) => eq.properties.mag >= minMag)
          .map((eq) => {
            const [lon, lat, depth] = eq.geometry.coordinates;
            const mag = eq.properties.mag;
            return (
              <CircleMarker
                key={eq.id}
                center={[lat, lon]}
                radius={getRadius(mag)}
                color={getColor(depth)}
                fillOpacity={0.6}
              >
                <Popup>
                  <strong>{eq.properties.place}</strong>
                  <br />
                  <b>Magnitude:</b> {mag}
                  <br />
                  <b>Depth:</b> {depth} km
                  <br />
                  <b>Time:</b>{" "}
                  {new Date(eq.properties.time).toLocaleString()}
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {/* Floating control panel */}
      <div className="control-panel">
        <h3>Filters</h3>
        <label>
          Min Magnitude: <b>{minMag}</b>
        </label>
        <input
          type="range"
          min="0"
          max="7"
          step="0.1"
          value={minMag}
          onChange={(e) => setMinMag(e.target.value)}
        />

        <button onClick={fetchData}>🔄 Refresh Data</button>

        <div className="legend">
          <h4>Depth Legend</h4>
          <div>
            <span className="dot shallow"></span> Shallow (&lt;70km)
          </div>
          <div>
            <span className="dot mid"></span> Intermediate (70–300km)
          </div>
          <div>
            <span className="dot deep"></span> Deep (&gt;300km)
          </div>
        </div>
      </div>
    </div>
  );
}

