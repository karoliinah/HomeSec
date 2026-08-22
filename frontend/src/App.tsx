
import { useState } from "react";
import { useDevices } from "./hooks/useDevices";
import { scanNetwork } from "./services/scan";

function App() {
  const { data, isLoading, error, refetch } = useDevices();
  const [scanning, setScanning] = useState(false);

  async function handleScan() {
    setScanning(true);

    try {
      await scanNetwork();
      await refetch();
    } finally {
      setScanning(false);
    }
  }

  if (isLoading) {
    return (
      <h2 style={{ padding: "40px" }}>
        Loading devices...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 style={{ padding: "40px" }}>
        Unable to connect to backend.
      </h2>
    );
  }

  const devices = data ?? [];

  const highRisk = devices.filter(
    (device: any) => device.risk_level === "High"
  ).length;

  const mediumRisk = devices.filter(
    (device: any) => device.risk_level === "Medium"
  ).length;

  const lowRisk = devices.filter(
    (device: any) => device.risk_level === "Low"
  ).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>🛡 HomeSec</h1>

      <p style={{ color: "#94a3b8" }}>
        Home Network Security Dashboard
      </p>

      <button
        onClick={handleScan}
        disabled={scanning}
        style={{
          marginTop: "20px",
          marginBottom: "30px",
          padding: "10px 20px",
          background: scanning ? "#475569" : "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: scanning ? "not-allowed" : "pointer",
        }}
      >
        {scanning ? "Scanning..." : "Scan Network"}
      </button>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Total Devices</h3>
          <p style={{ fontSize: "28px", margin: 0 }}>
            {devices.length}
          </p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>High Risk</h3>
          <p style={{ fontSize: "28px", margin: 0 }}>
            {highRisk}
          </p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Medium Risk</h3>
          <p style={{ fontSize: "28px", margin: 0 }}>
            {mediumRisk}
          </p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Low Risk</h3>
          <p style={{ fontSize: "28px", margin: 0 }}>
            {lowRisk}
          </p>
        </div>
      </section>

      <h2>Connected Devices</h2>

      {devices.length === 0 ? (
        <p style={{ color: "#94a3b8" }}>
          No devices found. Run a network scan.
        </p>
      ) : (
        devices.map((device: any) => (
          <div
            key={device.ip}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          >
            <h3>{device.hostname}</h3>

            <p>IP: {device.ip}</p>

            <p>MAC: {device.mac}</p>

            <p>Vendor: {device.vendor}</p>

            <p>
              Risk: <strong>{device.risk_level}</strong>
            </p>

            <p>Risk Score: {device.risk_score}</p>

            <p>
              Trusted: {device.trusted ? "Yes" : "No"}
            </p>
          </div>
        ))
      )}
    </main>
  );
}

export default App;

