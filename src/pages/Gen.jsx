
import { useReducer, useState } from "react";
import {  nextFileId } from "../utils/random";
import { isValidSenderMpid, normalizeInput } from "../utils/validate";
import { handleGenerateFlow } from "../generators";
import { FLOW_PLANS } from "../constants/constants";
import { ToggleSwitch } from "../components/Toggle";


const initialState = {
  senderMpid: "BIZZ",
  recipientMpid: "SIEM",
  flowName: "D0155",
  contractRef: "BIZZNHMO",
  retrievalMethod: "H",
};
function reducer(state, action) {
switch (action.type) {
  case "SET_FIELD":
    return { ...state, [action.field]: action.value };
  case "SET_FLOW":
    { const defaults = action.applyDefaults ? (FLOW_PLANS[action.value]?.defaultValues || {}) : {};
    return { ...state, flowName: action.value, ...defaults }; }
  case "APPLY_DEFAULTS":
    return { ...state, ...action.defaults };
  case "RESET":
    return initialState;
  default:
    return state;
  }
}

export default function Gen() {

  //state management
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isEditable, setIsEditable] = useState(false)

  //field errors
  const [senderError, setSenderError] = useState("");

  const FILE_COUNTER_KEY = "csv_file_counter";
  
  
  const handleToggleEdit = (checked) => {
    setIsEditable(checked);
    if (!checked) {
      const flowDefaults = FLOW_PLANS[state.flowName]?.defaultValues || {};
      dispatch({ type: "APPLY_DEFAULTS", defaults: flowDefaults });
    }
  };

  // Build + download on submit
  const handleGenerate = (e) => {
    e.preventDefault();
    console.log('generating...')
    const result = handleGenerateFlow(state);
    // Validate sender before proceeding
    if (result.error) {
        setSenderError(result.error);
    }

  };

  console.log('state', state)

  return (
    <div style={{ maxWidth: 760, margin: "40px auto", fontFamily: "system-ui, Arial, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>CSV Generator</h1>
      <p style={{ color: "#555", marginTop: 0 }}>
        Select a flow. You can preview its scenario defaults and optionally apply them to the fields.
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
        {/* Flow name (version fixed = 001) */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Flow name (version is 001)</span>
          <select value={state.flowName} onChange={(e) => dispatch({ type: "SET_FLOW", value: e.target.value, applyDefaults: !isEditable, })}>
            {Object.entries(FLOW_PLANS).map(([key,value])=>
            <option key={key} value={key}>{value.title}</option>
          )}
          </select>
            <small style={{ color: "#666" }}>
                Determines which file(s) will be generated.
            </small>
        </label>

        
        {/* Toggle to apply scenario defaults */}
        <ToggleSwitch 
          id="toggle-edit"
            checked={isEditable}
            onChange={(checked) => handleToggleEdit(checked)}
            label="Edit manually (leaveoff to use scenario defaults)"
        />

          <div style={{borderBottom: '1px solid grey'}}></div>
        
        {isEditable ? 
        <div style={{color: 'green'}}>
          <h3 style={{marginBottom: 0}}>Edit Mode</h3>
          <p style={{margin: 0}}>You can now edit the values to use for file generation</p></div> : 
        <div>
          <h3 style={{marginBottom: 0}}>Default Values</h3>
          <p style={{margin: 0}}>The process will use these default values to generate files</p></div>}
        {/* Sender MPID — text input with validation */}
        <label style={{ display: "grid", gap: 6 }}>
        <span>Sender MPID (4 letters)</span>
        <input
            type="text"
            inputMode="none"            // prevents mobile numeric keyboards
            autoCapitalize="characters" // iOS hint
            value={state.senderMpid}
            onChange={(e) => {
            const normalized = normalizeInput(e.target.value).slice(0,4);
            dispatch({ type: "SET_FIELD", field: "senderMpid", value: normalized })            
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
            background: isEditable ? "" : "#f9fafb",
            }}
            aria-invalid={!!senderError}
            aria-describedby="sender-mpid-error"
            required
            disabled={!isEditable}
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
          <select value={state.recipientMpid} disabled={!isEditable} onChange={(e) => dispatch({ type: "SET_FIELD", field: "recipientMpid", value: e.target.value })}>
            <option value="SIEM">SIEM</option>
            <option value="ELEC">ELEC</option>
          </select>
        </label>



        {/* Contract reference */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Contract reference</span>
            <input
                type="text"
                value={state.contractRef}
                disabled={!isEditable}
                onChange={(e) => {
                dispatch({ type: "SET_FIELD", field: "contractRef", value: e.target.value })
                }}
                placeholder="e.g., BIZZNHMO"
                style={{
                border: "1px solid #ccc",
                    padding: "8px",
                borderRadius: 6,
                background: isEditable ? "" : "#f9fafb",
                }}
            />
            <small style={{ color: "#666" }}>
                Auto‑fills as <code>{state.senderMpid || "????"}NHMO</code>. You can edit it with lowercase letters, numbers and special characters.
            </small>

        </label>

        {/* Retrieval method */}
        <label style={{ display: "grid", gap: 6 }}>
          <span>Retrieval method (CHAR1)</span>
          <select value={state.retrievalMethod} disabled={!isEditable} onChange={(e) => dispatch({ type: "SET_FIELD", field: "retrievalMethod", value: e.target.value })}>
            {/* HH: H, NHH-trad-meter: H, NHH-AMR: R, NHH-smart-meter: S */}
            <option value="H">HH (H)</option>
            <option value="H">NHH - traditional meter (H)</option>
            <option value="R">NHH - AMR (R)</option>
            <option value="S">NHH - smart meter (S)</option>
          </select>
        </label>
          <div style={{borderBottom: '1px solid grey', marginBottom: '1rem', marginTop: '1rem'}}></div>

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
            onClick={()=> dispatch({ type: "RESET" })}
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
          <li>Sender MPID: <code>{state.senderMpid}</code></li>
          <li>Recipient MPID: <code>{state.recipientMpid}</code></li>
          <li>File Identifier (next): <code>{(() => { const id = nextFileId(FILE_COUNTER_KEY); localStorage.setItem(FILE_COUNTER_KEY, String(Number(localStorage.getItem(FILE_COUNTER_KEY)) - 1)); return id; })()}</code> (CHAR10)</li>
        </ul>
        <p style={{ color: "#666" }}>
          The file identifier increments each time you generate a file (persisted in your browser).
        </p>
      </div>
       </div>
  );
}