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

type Analysis = {
  error?: boolean;
  message?: string;
  device_id?: number;
  analysis?: string;
  model?: string;
  created_at?: string;
};

function parseAnalysis(text: string) {
  const summary =
    text.match(/SUMMARY:\s*([\s\S]*?)(?=\n\s*RISKS:|$)/)?.[1]?.trim() ??
    "";

  const risks =
    text.match(
      /RISKS:\s*([\s\S]*?)(?=\n\s*RECOMMENDATIONS:|$)/
    )?.[1]?.trim() ?? "";

  const recommendations =
    text.match(/RECOMMENDATIONS:\s*([\s\S]*)/)?.[1]?.trim() ?? "";

  const cleanItems = (value: string) =>
    value
      .split("\n")
      .map((line) =>
        line
          .replace(/^\s*[\*\-]\s*/, "")
          .replace(/\*\*/g, "")
          .trim()
      )
      .filter(Boolean);

  return {
    summary,
    risks: cleanItems(risks),
    recommendations: cleanItems(recommendations),
  };
}

function App() {
  const { data, isLoading, error, refetch } = useDevices();

  const [scanning, setScanning] = useState(false);
  const [analyzingDevice, setAnalyzingDevice] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

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
      <main className="app loading-screen">
        <div className="loading-content">
          <div className="loading-logo">🛡</div>
          <h2>Loading HomeSec...</h2>
          <p>Connecting to your security dashboard</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app loading-screen">
        <div className="error-content">
          <div className="loading-logo">⚠</div>
          <h2>Unable to connect to HomeSec</h2>
          <p>
            Make sure the backend API is running and try again.
          </p>
        </div>
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

  const selectedDevice =
    analysis && !analysis.error
      ? devices.find((device) => device.id === analysis.device_id)
      : null;

  const parsedAnalysis =
    analysis?.analysis ? parseAnalysis(analysis.analysis) : null;

  return (
    <main className="app">
      <div className="dashboard">
        <header className="header">
          <div className="brand">
            <div className="brand-icon">🛡</div>

            <div>
              <h1>HomeSec</h1>
              <p>Home Network Security Dashboard</p>
            </div>
          </div>

          <button
            className="scan-button"
            onClick={handleScan}
            disabled={scanning}
          >
            <span>{scanning ? "◌" : "↻"}</span>
            {scanning ? "Scanning network..." : "Scan Network"}
          </button>
        </header>

        <section className="hero-section">
          <div>
            <p className="eyebrow">SECURITY OVERVIEW</p>

            <h2>Your network at a glance</h2>

            <p className="hero-description">
              Monitor connected devices, identify exposed services, and
              understand potential security risks across your home network.
            </p>
          </div>

          <div className="network-status">
            <span className="status-dot" />
            <span>Network monitoring active</span>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon devices-icon">◈</div>

            <div>
              <p>Total Devices</p>
              <strong>{devices.length}</strong>
            </div>
          </div>

          <div className="stat-card high-risk-card">
            <div className="stat-icon high-icon">!</div>

            <div>
              <p>High Risk</p>
              <strong>{highRisk}</strong>
            </div>
          </div>

          <div className="stat-card medium-risk-card">
            <div className="stat-icon medium-icon">!</div>

            <div>
              <p>Medium Risk</p>
              <strong>{mediumRisk}</strong>
            </div>
          </div>

          <div className="stat-card low-risk-card">
            <div className="stat-icon low-icon">✓</div>

            <div>
              <p>Low Risk</p>
              <strong>{lowRisk}</strong>
            </div>
          </div>
        </section>

        <section className="devices-section">
          <div className="section-header">
            <div>
              <p className="eyebrow">NETWORK INVENTORY</p>
              <h2>Connected Devices</h2>
            </div>

            <span className="device-count">
              {devices.length} device{devices.length !== 1 ? "s" : ""}
            </span>
          </div>

          {devices.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◌</div>
              <h3>No devices found</h3>
              <p>Run a network scan to discover devices.</p>
            </div>
          ) : (
            <div className="device-grid">
              {devices.map((device) => (
                <article className="device-card" key={device.id}>
                  <div className="device-card-header">
                    <div className="device-title">
                      <div className="device-icon">
                        {device.hostname.toLowerCase().includes("router")
                          ? "⌁"
                          : "◈"}
                      </div>

                      <div>
                        <h3>{device.hostname}</h3>
                        <span>{device.ip}</span>
                      </div>
                    </div>

                    <div className="risk-summary">
                      <span
                        className={`risk-badge risk-${device.risk_level.toLowerCase()}`}
                      >
                        {device.risk_level}
                      </span>

                      <span className="risk-score">
                        Score {device.risk_score}
                      </span>
                    </div>
                  </div>

                  <div className="device-details">
                    <div>
                      <span>MAC ADDRESS</span>
                      <p>{device.mac || "Unknown"}</p>
                    </div>

                    <div>
                      <span>VENDOR</span>
                      <p>{device.vendor || "Unknown"}</p>
                    </div>

                    <div>
                      <span>TRUST STATUS</span>
                      <p>
                        <span
                          className={
                            device.trusted
                              ? "trusted-status"
                              : "untrusted-status"
                          }
                        >
                          {device.trusted ? "Trusted" : "Not trusted"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="ports-section">
                    <div className="ports-header">
                      <h4>Open Services</h4>

                      <span>
                        {device.open_ports?.length ?? 0} detected
                      </span>
                    </div>

                    {device.open_ports?.length > 0 ? (
                      <div className="ports-list">
                        {device.open_ports.map((port) => (
                          <div className="port-item" key={port.id}>
                            <div className="port-number">
                              {port.port}
                            </div>

                            <div className="port-info">
                              <strong>{port.service}</strong>

                              <span>
                                {port.protocol.toUpperCase()} ·{" "}
                                {port.state}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-ports">
                        No open ports detected.
                      </p>
                    )}
                  </div>

                  <div className="device-actions">
                    <button
                      className="ai-button"
                      onClick={() => handleAnalyze(device.id)}
                      disabled={analyzingDevice === device.id}
                    >
                      <span>✦</span>

                      {analyzingDevice === device.id
                        ? "Analyzing security..."
                        : "Analyze with AI"}
                    </button>

                    <span className="last-seen">
                      Last seen:{" "}
                      {new Date(device.last_seen).toLocaleString()}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {analysis && (
        <div className="modal-overlay">
          <div className="analysis-modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">AI SECURITY INSIGHT</p>

                <h2>Security Analysis</h2>

                {selectedDevice && (
                  <p className="analysis-device">
                    {selectedDevice.hostname} · {selectedDevice.ip}
                  </p>
                )}
              </div>

              <button
                className="close-button"
                onClick={() => setAnalysis(null)}
                aria-label="Close analysis"
              >
                ×
              </button>
            </div>

            {analysis.error ? (
              <div className="analysis-error">
                <span>⚠</span>

                <div>
                  <h3>Analysis unavailable</h3>
                  <p>{analysis.message}</p>
                </div>
              </div>
            ) : (
              <div className="analysis-content">
                <div className="analysis-meta">
                  <span>✦ AI-generated security assessment</span>

                  {analysis.model && (
                    <span className="model-badge">
                      {analysis.model}
                    </span>
                  )}
                </div>

                {parsedAnalysis && (
                  <div className="structured-analysis">
                    <section className="analysis-section summary-section">
                      <div className="analysis-section-title">
                        <span className="analysis-section-icon">
                          ◉
                        </span>

                        <h3>Summary</h3>
                      </div>

                      <p className="summary-text">
                        {parsedAnalysis.summary}
                      </p>
                    </section>

                    <section className="analysis-section">
                      <div className="analysis-section-title">
                        <span className="analysis-section-icon risk-icon">
                          !
                        </span>

                        <h3>Security Risks</h3>
                      </div>

                      <div className="analysis-list">
                        {parsedAnalysis.risks.map((risk, index) => (
                          <div
                            className="analysis-list-item"
                            key={index}
                          >
                            <span className="risk-indicator">
                              !
                            </span>

                            <p>{risk}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="analysis-section recommendations-section">
                      <div className="analysis-section-title">
                        <span className="analysis-section-icon recommendation-icon">
                          ✓
                        </span>

                        <h3>Recommendations</h3>
                      </div>

                      <div className="analysis-list">
                        {parsedAnalysis.recommendations.map(
                          (recommendation, index) => (
                            <div
                              className="analysis-list-item recommendation-item"
                              key={index}
                            >
                              <span className="recommendation-number">
                                {index + 1}
                              </span>

                              <p>{recommendation}</p>
                            </div>
                          )
                        )}
                      </div>
                    </section>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default App;