
import { useMemo, useState } from "react";
import {  pad } from "../utils/date";
import {  nextFileId, randomInt, randomPastDateYYYYMMDD, randomRef } from "../utils/random";
import { isValidSenderMpid, normalizeInput } from "../utils/validate";
import { handleGenerateFlow } from "../generators";

export default function Gen() {
  // Inputs from user
  const [senderMpid, setSenderMpid] = useState("BIZZ"); // keep your default if you like
  const [senderError, setSenderError] = useState("");
  const [recipientMpid, setRecipientMpid] = useState("SIEM"); // 'SIEM' or 'ELEC'
  const [flowName, setFlowName] = useState("D0155"); // flow name; version fixed '001'
  const [contractRef, setContractRef] = useState("BIZZNHMO"); 
  const [contractDirty, setContractDirty] = useState(false);
  const [retrievalMethod, setRetrievalMethod] = useState("H"); // 'H', 'R', 'S'

  // ephemeral values for preview (regenerate per render)
  const regEffective = useMemo(() => randomPastDateYYYYMMDD(180, 1500), []);
  const mopStart = useMemo(() => randomPastDateYYYYMMDD(60, 900), []);
  const serviceRef = useMemo(() => randomRef(4), []);
  const serviceLevelRef = useMemo(() => pad(randomInt(1, 9999), 4), []);
  const FILE_COUNTER_KEY = "csv_file_counter";
  
  // Build + download on submit
  const handleGenerate = (e) => {
      e.preventDefault();
    console.log('generating')
    
    const result = handleGenerateFlow({
        senderMpid,
        recipientMpid,
        contractRef,
        retrievalMethod,
        flowName
    });

    
    // Validate sender before proceeding
    if (result.error) {
        setSenderError(result.error);
    }

  };

  // Reset form
  const handleReset = () => {
    setSenderMpid("BIZZ");
    setRecipientMpid("SIEM");
    setFlowName("D0155");
    setContractRef("BIZZNHMO");
    setRetrievalMethod("H");
  };

  console.log('sender', senderMpid)
  return (
    <div style={{ maxWidth: 760, margin: "40px auto", fontFamily: "system-ui, Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>CSV Generator</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Fill the form and click <strong>Generate CSV</strong>. A pipe‑delimited CSV will download to your device.
      </p>

      <form
        onSubmit={handleGenerate}
        style={{
          display: "grid",
          gap: "12px",
          padding: "16px",
          border: "1px solid #ddd",
          borderRadius: 8,
          background: "#fafafa",
          color: 'black',
          textAlign: 'left'
        }}
      >
        
        {/* Sender MPID — text input with validation */}
        <label style={{ display: "grid", gap: 6 }}>
        <span>Sender MPID (4 letters)</span>
        <input
            type="text"
            inputMode="none"            // prevents mobile numeric keyboards
            autoCapitalize="characters" // iOS hint
            value={senderMpid}
            onChange={(e) => {
            const normalized = normalizeInput(e.target.value).slice(0,4);
            setSenderMpid(normalized);
            // Build the auto value: SENDERMPID + NHMO (if sender present)
            const auto = normalized ? `${normalized}NHMO` : "NHMO";
            // Only update automatically when the user hasn't edited yet,
            // OR when the current value still matches the previous auto pattern.
            // This prevents clobbering the user's manual edits.
            if (!contractDirty || /^[A-Z]{4}NHMO$/.test(contractRef)) {
                setContractRef(auto);
            }
            setSenderError(
                normalized.length === 0
                ? "Sender MPID is required."
                : isValidSenderMpid(normalized)
                ? ""
                : "Sender MPID must be exactly 4 letters (A–Z)."
            );
            }}
            placeholder="e.g., BIZZ"
            maxLength={4}
            style={{
            border: senderError ? "1px solid #dc2626" : "1px solid #ccc",
            padding: "8px",
            borderRadius: 6,
            }}
            aria-invalid={!!senderError}
            aria-describedby="sender-mpid-error"
            required
        />
        {senderError && (
            <small
            id="sender-mpid-error"
            style={{ color: "#dc2626", marginTop: 4 }}
            >
            {senderError}
            </small>
        )}
        </label>

        {/* Recipient MPID */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Recipient MPID (CHAR4)</span>
          <select value={recipientMpid} onChange={(e) => setRecipientMpid(e.target.value)}>
            <option value="SIEM">SIEM</option>
            <option value="ELEC">ELEC</option>
          </select>
        </label>

        {/* Flow name (version fixed = 001) */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Flow name (version is 001)</span>
          <select value={flowName} onChange={(e) => setFlowName(e.target.value)}>
            <option value="D0155">D0155</option>
            <option value="D0155+D0148">D0155 + D0148 (two files)</option>
            <option value="D0148">D0148 (one file)</option>
            {/* add more flows here if needed */}
          </select>
            <small style={{ color: "#666" }}>
                Determines which file(s) will be generated.
            </small>
        </label>


        {/* Contract reference */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Contract reference</span>
            <input
                type="text"
                value={contractRef}
                onChange={(e) => {
                const normalized = normalizeInput(e.target.value);
                setContractRef(normalized);
                setContractDirty(true); // mark as manually edited
                }}
                placeholder="e.g., BIZZNHMO"
                style={{
                border: "1px solid #ccc",
                    padding: "8px",
                borderRadius: 6,
                }}
            />
            <small style={{ color: "#666" }}>
                Auto‑fills as <code>{senderMpid || "????"}NHMO</code>. You can edit it; it stays uppercase.
            </small>

        </label>

        {/* Retrieval method */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Retrieval method (CHAR1)</span>
          <select value={retrievalMethod} onChange={(e) => setRetrievalMethod(e.target.value)}>
            {/* HH: H, NHH-trad-meter: H, NHH-AMR: R, NHH-smart-meter: S */}
            <option value="H">HH (H)</option>
            <option value="H">NHH - traditional meter (H)</option>
            <option value="R">NHH - AMR (R)</option>
            <option value="S">NHH - smart meter (S)</option>
          </select>
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
            onClick={handleReset}
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

      {/* Preview (optional)—helps verify values before download */}
      <div style={{ marginTop: 20, fontSize: 14, color: "#444" }}>
        <h3 style={{ margin: 0 }}>Preview of generated/used values</h3>
        <ul style={{ marginTop: 8, lineHeight: 1.6 }}>
          <li>Sender MPID: <code>{senderMpid}</code></li>
          <li>Recipient MPID: <code>{recipientMpid}</code></li>
          <li>Registration Effective Date (REGI EFD): <code>{regEffective}</code></li>
          <li>MOP appointment start date: <code>{mopStart}</code></li>
          <li>Service reference / level: <code>{serviceRef}</code> / <code>{serviceLevelRef}</code></li>
          <li>File Identifier (next): <code>{(() => { const id = nextFileId(FILE_COUNTER_KEY); localStorage.setItem(FILE_COUNTER_KEY, String(Number(localStorage.getItem(FILE_COUNTER_KEY)) - 1)); return id; })()}</code> (CHAR10)</li>
        </ul>
        <p style={{ color: "#666" }}>
          The file identifier increments each time you generate a file (persisted in your browser).
        </p>
      </div>
       </div>
  );
}