import React from "react";


function StatBox({label, value}: { label: string; value: number; }) {
  return (
    <div className="attribute-row">
      <span className="attribute-label">{label}</span>
      <span className="attribute-value">
        {Math.round(value)}
      </span>
    </div>
  );
}

export default StatBox;
