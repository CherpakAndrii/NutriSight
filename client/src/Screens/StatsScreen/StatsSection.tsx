import React from "react";
import {StatisticsEntry} from "../../Utils/response-types";
import StatBox from './StatBox';

function StatsSection({ title, entry}: { title: string; entry: StatisticsEntry; }) {
  return (
      <div style={{marginTop: 12, marginBottom: 12}}>
          <h3>{title}</h3>
          <StatBox label="Calories" key="Calories" value={entry.calories} />
          <StatBox label="Proteins" key="Proteins" value={entry.proteins} />
          <StatBox label="Fats" key="Fats" value={entry.fats} />
          <StatBox label="Carbs" key="Carbs" value={entry.carbs} />
      </div>
  );
}

export default StatsSection;
