import { useState } from "react";
import { useDevices } from "./hooks/useDevices";
import { scanNetwork } from "./services/scan";
import { analyzeDevice } from "./services/api";

type Port = {
  id: number;
  port: number;
  protocol: string;
  service: string;
  state: string;
};

type Device = {
  id: number;
  hostname: string;
  ip: string;
  mac: string;
  vendor: string;
  risk_score: number;
  risk_level: string;
  trusted: boolean;
  first_seen: string;
  last_seen: string;
  open_ports: Port[];
};

function App() {
  const { data, isLoading, error, refetch } = useDevices();

  const [scanning, setScanning] = useState(false);
  const [analyzingDevice, setAnalyzingDevice] = useState<number | null>(
    null
  );
  const [analysis, setAnalysis] = useState<any>(null);

  async function handleScan() {
    setScanning(true);

    try {
      await scanNetwork();
      await refetch();
    } catch (error) {
      console.error("Network scan failed:", error);
    } finally {
      setScanning(false);
    }
  }

  async function handleAnalyze(deviceId: number) {
    setAnalyzingDevice(deviceId);
    setAnalysis(null);

    try {
      const result = await analyzeDevice(deviceId);

      console.log("AI response:", result);

      setAnalysis(result);
    } catch (error) {
      console.error("AI analysis failed:", error);

      setAnalysis({
        error: true,
        message:
          "Unable to generate AI security analysis. Please check the backend logs.",
      });
    } finally {
      setAnalyzingDevice(null);
    }
  }

  if (isLoading) {
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
        <h2>Loading devices...</h2>
      </main>
    );
  }

  if (error) {
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
        <h2>Unable to connect to backend.</h2>
        <p style={{ color: "#94a3b8" }}>
          Make sure the HomeSec API is running.
        </p>
      </main>
    );
  }

  const devices: Device[] = data ?? [];

  const highRisk = devices.filter(
    (device) => device.risk_level === "High"
  ).length;

  const mediumRisk = devices.filter(
    (device) => device.risk_level === "Medium"
  ).length;

  const lowRisk = devices.filter(
    (device) => device.risk_level === "Low"
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

      {/* Dashboard statistics */}

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
        devices.map((device) => (
          <div
            key={device.id}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "10px",
              marginTop: "15px",
            }}
          >
            {/* Device information */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h3 style={{ marginTop: 0 }}>
                  {device.hostname}
                </h3>

                <p>IP: {device.ip}</p>

                <p>MAC: {device.mac}</p>

                <p>Vendor: {device.vendor}</p>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <p>
                  Risk:{" "}
                  <strong>{device.risk_level}</strong>
                </p>

                <p>
                  Risk Score:{" "}
                  <strong>{device.risk_score}</strong>
                </p>
              </div>
            </div>

            {/* Open ports */}

            <div
              style={{
                marginTop: "20px",
                paddingTop: "15px",
                borderTop: "1px solid #334155",
              }}
            >
              <h4>🔌 Open Ports</h4>

              {device.open_ports &&
              device.open_ports.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {device.open_ports.map((port) => (
                    <div
                      key={port.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#0f172a",
                        padding: "10px 14px",
                        borderRadius: "6px",
                      }}
                    >
                      <div>
                        <strong>
                          {port.port}
                        </strong>

                        <span
                          style={{
                            marginLeft: "10px",
                            color: "#94a3b8",
                          }}
                        >
                          {port.protocol.toUpperCase()}
                        </span>
                      </div>

                      <span>
                        {port.service}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  No open ports detected.
                </p>
              )}
            </div>

            {/* AI analysis button */}

            <button
              onClick={() =>
                handleAnalyze(device.id)
              }
              disabled={
                analyzingDevice === device.id
              }
              style={{
                marginTop: "20px",
                padding: "10px 18px",
                background:
                  analyzingDevice === device.id
                    ? "#475569"
                    : "#7c3aed",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor:
                  analyzingDevice === device.id
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {analyzingDevice === device.id
                ? "Analyzing..."
                : "🤖 Analyze with AI"}
            </button>

            <p
              style={{
                marginTop: "15px",
                color: "#94a3b8",
              }}
            >
              Trusted:{" "}
              {device.trusted ? "Yes" : "No"}
            </p>
          </div>
        ))
      )}

      {/* AI Analysis Modal */}

      {analysis && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#1e293b",
              borderRadius: "12px",
              padding: "30px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h2>🤖 AI Security Analysis</h2>

              <button
                onClick={() => setAnalysis(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#94a3b8",
                  fontSize: "24px",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {analysis.error ? (
              <p
                style={{
                  color: "#f87171",
                }}
              >
                {analysis.message}
              </p>
            ) : (
              <>
                <p
                  style={{
                    color: "#94a3b8",
                  }}
                >
                  Device ID: {analysis.device_id}
                </p>

                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontFamily: "Arial",
                    lineHeight: 1.6,
                    background: "#0f172a",
                    padding: "20px",
                    borderRadius: "8px",
                  }}
                >
                  {analysis.analysis}
                </pre>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;