import React, { useState } from "react";
import {StatisticsEntry} from "../../Utils/response-types";
import {getStatistics} from "../../Utils/queries";
import {DataLoadingStatus} from "../../Utils/enums";
import StatsSection from './StatsSection'

function StatisticsPage() {
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>(DataLoadingStatus.NotLoaded);
  const [todayStats, setTodayStats] = useState<StatisticsEntry | undefined>(undefined);
  const [weekStats, setWeekStats] = useState<StatisticsEntry | undefined>(undefined);

  if (dataLoadingStatus === DataLoadingStatus.NotLoaded) {
      setDataLoadingStatus(DataLoadingStatus.Loading);
        getStatistics().then(resp => {
          if (resp.today || resp.average_last_7_days) {
              if (resp.today) {
                  setTodayStats(resp.today);
              }
              if (resp.average_last_7_days) {
                  setWeekStats(resp.average_last_7_days);
              }
              setDataLoadingStatus(DataLoadingStatus.Loaded);
          }
          else{
              setDataLoadingStatus(DataLoadingStatus.Error);
          }
        });
  }

  if (dataLoadingStatus !== DataLoadingStatus.Loaded) return (
      <div className="empty-page">
          <h3 className="empty-page-title">{dataLoadingStatus === DataLoadingStatus.Error? "Error loading statistics" : "Loading your statistics..."}</h3>
      </div>
  );

  return (
      <div className="base-page">
          <StatsSection title="Today" entry={todayStats!}/>
          <StatsSection title="Average (Last 7 Days)" entry={weekStats!}/>
      </div>
  );
}

export default StatisticsPage;
