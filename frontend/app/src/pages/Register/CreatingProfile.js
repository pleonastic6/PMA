import ModernInput from "../../components/form_elements/ModernInput";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function ContinueBtn({text=""}){
    return (
        <div className = "flex justify-end">
            <NavLink to="/SelectingPictures">continue</NavLink>
        </div>
    )
}



export function ModernTextarea({className="", text, input="text"}) {
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

      <textarea
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
        maxLength={200}
        style={{height: 200}}
      />
    </div>
  );
}

export default function CreatingProfile() {

    return (
        <main>
            <div className="flex justify-center">
                <div className="flex rounded-2xl overflow-hidden shadow-lg p-4 m-16">
                    <div className="flex flex-col gap-6">
                        <div><h1 className="text-3xl font-extrabold">Now something about you</h1><div className="relative w-9 h-1 bg-gradient-to-r from-[#af6aff] to-[#df78ff41] rounded" /></div>
            
                        <ModernInput text="First Name"/>
                        <ModernInput text="Last Name"/>
                        <ModernTextarea text="Biography"/>
                        <ModernInput text="Interests"/>
                        
                        <ContinueBtn text="continue"/>
                    </div>
                </div>
            </div>
        </main>
    )
}