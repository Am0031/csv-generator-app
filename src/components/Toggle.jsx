
// ToggleSwitch.jsx
import React from "react";

export function ToggleSwitch({
  checked,
  onChange,
  label,
  id = "toggle-edit",
  disabled = false,
  className = "",
}) {
  return (
    <div
      className={`toggle-switch ${className}`}
      style={{ display: "flex", alignItems: "center", gap: 12 }}
    >
      {/* Visually hidden but accessible checkbox */}
      <input
        id={id}
        type="checkbox"
        role="switch"
        aria-checked={checked}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
        className="toggle-switch__input"
        style={{
          // Screen-reader-only styles (sr-only)
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />

      {/* Visual switch */}
      <label
        htmlFor={id}
        className={`toggle-switch__label ${checked ? "is-on" : "is-off"} ${
          disabled ? "is-disabled" : ""
        }`}
        style={{
          cursor: disabled ? "not-allowed" : "pointer",
          display: "inline-block",
          position: "relative",
          width: 48,
          height: 28,
          borderRadius: 999,
          background: checked ? "#2563eb" : "#e5e7eb",
          boxShadow: checked
            ? "inset 0 0 0 1px rgba(0,0,0,0.08)"
            : "inset 0 0 0 1px rgba(0,0,0,0.08)",
          transition: "background-color 160ms ease",
        }}
        // Focus ring when the input receives focus
        onMouseDown={(e) => e.preventDefault()} // prevent text selection on drag
      >
        <span
          aria-hidden="true"
          className="toggle-switch__thumb"
          style={{
            position: "absolute",
            top: 2,
            left: checked ? 26 : 2,
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "#fff",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.06)",
            transition: "left 160ms ease",
          }}
        />
      </label>

      {label && (
        <label
          htmlFor={id}
          style={{
            cursor: disabled ? "not-allowed" : "pointer",
            color: disabled ? "#9ca3af" : "#111827",
          }}
        >
          {label}
        </label>
      )}
    </div>
  );
}