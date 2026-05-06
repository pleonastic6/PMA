import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Dropdown({ text, items = [], value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative flex items-center">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 text-slate-700 font-medium focus:outline-none group"
            >
                <span className="text-gray-400 group-hover:text-indigo-400 transition-colors">
                    {text}
                </span>
                <span className="flex items-center gap-1 font-bold group-hover:text-indigo-600 transition-colors">
                    {value}
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} strokeWidth={2} />
                </span>
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 left-0 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 min-w-[120px] text-left animate-in fade-in slide-in-from-top-2 duration-200">
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                onChange(item);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-left transition-colors hover:bg-indigo-50 ${value === item
                                ? "text-indigo-600 font-bold bg-indigo-50/50"
                                : "text-slate-600 font-medium"
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}