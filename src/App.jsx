
import './App.css'
import { useState } from "react";

// Utility to safely escape values for CSV
function csvEscape(value) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  const needsQuotes = /[",\n\r]/.test(str);
  const escaped = str.replace(/"/g, '""'); // escape internal quotes
  return needsQuotes ? `"${escaped}"` : escaped;
}

// Build CSV content (UTF-8 with BOM so Excel opens it nicely)
function buildCsv(headers, rows) {
  const headerLine = headers.map(csvEscape).join(",");
  const rowLines = rows.map((r) => r.map(csvEscape).join(","));
  const csvString = [headerLine, ...rowLines].join("\r\n");

  // Add BOM for Excel compatibility
  const BOM = "\uFEFF";
  return BOM + csvString;
}

// Trigger browser download of a text blob
function downloadTextFile(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function App() {
  // "few bits of info"—adjust fields as needed
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");

  // Example CSV layout:
  // Row 1: Headers
  // Row 2: User-provided data
  // Row 3+: A couple of static/example lines to show structure
  const handleGenerateCsv = () => {
    // Define headers
    const headers = ["Full Name", "Email", "Department", "Quantity", "Notes"];

    // Define rows—first one uses user input
    const rows = [
      [fullName, email, department, quantity, notes],
      // Additional lines just as examples:
      ["Alice Wonderland", "alice@example.com", "Marketing", 5, "Sample row"],
      ["Bob Builder", "bob@example.com", "Engineering", 3, "Another sample"],
    ];

    const csv = buildCsv(headers, rows);

    // Download with timestamp-based filename
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const filename = `export-${timestamp}.csv`;
    downloadTextFile(filename, csv);
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "system-ui, Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>CSV Generator</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Fill the form and click <strong>Generate CSV</strong>. A file will be downloaded to your device.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerateCsv();
        }}
        style={{
          display: "grid",
          gap: "12px",
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: 8,
          background: "#fafafa",
        }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Full Name</span>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g., Amelie Pira"
            required
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., amelie@example.com"
            required
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Department</span>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g., CSS EYS"
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Quantity</span>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Notes</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes..."
            rows={3}
          />
        </label>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            style={{
              background: "#2563eb",
              color: "white",
              border: 0,
              padding: "10px 16px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Generate CSV
          </button>
          <button
            type="button"
            onClick={() => {
              setFullName("");
              setEmail("");
              setDepartment("");
              setQuantity(1);
              setNotes("");
            }}
            style={{
              background: "#e5e7eb",
              color: "#111",
              border: 0,
              padding: "10px 16px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </form>

      <p style={{ marginTop: 16, color: "#666" }}>
        Tip: If you open the CSV in Excel and see odd characters, the BOM above helps Excel detect UTF‑8.
      </p>
    </div>
  );
}

