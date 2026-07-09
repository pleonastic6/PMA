import { useState } from "react";

export default function ModernInput({
  className = "",
  text,
  input = "text",
  value,
  onChange,
  placeholder = "",
  id,
  name,
}) {
  const [internalValue, setInternalValue] = useState("");
  const [focused, setFocused] = useState(false);
  const resolvedValue = value ?? internalValue;

  const isActive = focused || String(resolvedValue).length > 0;

  function handleChange(event) {
    if (onChange) {
      onChange(event);
      return;
    }

    setInternalValue(event.target.value);
  }

  return (
    <div className="relative w-80">
      <label
        htmlFor={id}
        className={`
          bg absolute left-3 px-1 pointer-events-none
          transition-transform duration-200 ease-in-out
          ${
            isActive
              ? "top-[-8px] text-xs text-blue-500"
              : "top-4 text"
          }
        `}
      >
        {text}
      </label>

      <input
        id={id}
        name={name}
        className={`
          w-full rounded-lg border border-gray-300 dark:border-gray-400
          px-3 pt-5 pb-2 text-base bg-inherit
          outline-none transition-colors duration-200
          ${className}
        `}
        type={input}
        value={resolvedValue}
        placeholder={placeholder}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}
