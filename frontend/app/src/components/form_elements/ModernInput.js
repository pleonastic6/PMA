import { useState } from "react";

export default function ModernInput(probs) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const isActive = focused || value.length > 0;

  return (
    <div style={styles.wrapper}>
      <label
        style={{
          ...styles.label,
          ...(isActive ? styles.labelActive : {}),
        }}
      >
        {probs.text}
      </label>

      <input
        type={probs.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  wrapper: {
    position: "relative",
    width: "320px",
    marginTop: "40px",
    fontFamily: "Arial, sans-serif",
  },

  input: {
    width: "100%",
    padding: "20px 12px 8px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    transition: "border-color 0.2s",
  },

  label: {
    position: "absolute",
    left: "12px",
    top: "16px",
    color: "#777",
    background: "white",
    fontSize: "16px",
    padding: "0 4px",
    pointerEvents: "none",
    transition: "all 0.2s ease",
  },

  labelActive: {
    top: "-8px",
    left: "10px",
    fontSize: "12px",
    color: "#1a73e8",
  },
};