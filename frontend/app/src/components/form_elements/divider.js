export function Divider(probs) {
    return (
        <div className="flex items-center mt-16 bg-gre">
            <div style={divstyle} />
            <span className="text-sm text-stone-400 px-1">{probs.text}</span>
            <div style={divstyle} />
        </div>
    )
}


const divstyle= {
    flexGrow: "1",
    background: "#c4c4c4",
    height: "1px"
}