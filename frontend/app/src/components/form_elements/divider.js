import React from 'react';

export const Divider = (props) => {
  return (
    <div className="flex items-center mt-12">
      <div style={divstyle} />
      <span className="text-sm text-stone-400 px-1">{props.text}</span>
      <div style={divstyle} />
    </div>
  );
};

const divstyle = {
  flexGrow: "1",
  background: "#c4c4c4",
  height: "1px"
};