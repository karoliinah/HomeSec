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
    return <h2 style={{ padding: "40px" }}>Loading devices...</h2>;
  }

  if (error) {
    return <h2 style={{ padding: "40px" }}>Unable to connect to backend.</h2>;
  }

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

      <button
        onClick={handleScan}
        disabled={scanning}
        style={{
          marginTop: "20px",
          marginBottom: "30px",
          padding: "10px 20px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {scanning ? "Scanning..." : "Scan Network"}
      </button>

      <p>Connected devices: {data?.length ?? 0}</p>

      {(data ?? []).map((device: any) => (
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

          <p>Vendor: {device.vendor}</p>

          <p>
            Risk: <strong>{device.risk_level}</strong>
          </p>

          <p>Score: {device.risk_score}</p>
        </div>
      ))}
    </main>
  );
}

export default App;