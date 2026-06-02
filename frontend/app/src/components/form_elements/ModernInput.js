import { useState } from "react";

export default function ModernInput({className="", text, input="text"}) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const isActive = focused || value.length > 0;

  return (
    <div className="relative w-80">
      <label
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
        className={`
          w-full rounded-lg border border-gray-300 dark:border-gray-400
          px-3 pt-5 pb-2 text-base bg-inherit
          outline-none transition-colors duration-200
          ${className}
        `}
        type={input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}