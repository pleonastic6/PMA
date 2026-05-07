export function Button(probs) {
    return (<button className="flex items-center relative bg-indigo-950 mt-16 m-auto rounded-md overflow-hidden">
        <span className="text-stone-100 px-8 py-2 before:absolute before:left-0 before:top-0 before:w-0 before:h-full before:bg-white before:bg-opacity-15 before:transition-all before:duration-200 hover:before:w-full">
            {probs.text}
        </span>
    </button>)
}