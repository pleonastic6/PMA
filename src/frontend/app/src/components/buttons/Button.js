export function Button({ text, type = "button", onClick, disabled = false, className = "" }) {
    return (
    <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center relative bg-indigo-950 mt-4 rounded-md overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
        <span className="w-full px-8 py-2 before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-white before:bg-opacity-15 before:transition-all before:duration-200 hover:before:w-full">
            {text}
        </span>
    </button>
    )
}
