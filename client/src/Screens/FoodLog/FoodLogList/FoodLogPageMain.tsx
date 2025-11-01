import React, {useCallback, useState, useMemo} from "react";
import { getFoodLogEntries } from "../../../Utils/queries";
import {UserMeal} from "../../../Utils/response-types";
import {DataLoadingStatus, MealTime, SourceType} from "../../../Utils/enums";
import FoodLogEntryGroup from "./FoodLogEntryGroup";
import {faCamera, faKeyboard, faMagnifyingGlassPlus} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useNavigate} from "react-router-dom";
import {FoodLogTemplate} from "../FoodLogTemplate";

const FoodLogPageMain = (props: {setSelectedTemplate: React.Dispatch<React.SetStateAction<FoodLogTemplate|undefined>>, foodLog: UserMeal[], setFoodLog: React.Dispatch<React.SetStateAction<UserMeal[]>>}) => {
  const navigate = useNavigate();
  const [dataLoadingStatus, setDataLoadingStatus] = useState<DataLoadingStatus>(DataLoadingStatus.NotLoaded);
  const [loadedEntriesAmount, setLoadedEntriesAmount] = useState<number>(50);

  const fetchFoodLogs = useCallback((amount: number) => {
      getFoodLogEntries(amount).then(resp => {
          if (resp.food_log) {
              props.setFoodLog(resp.food_log);
              setDataLoadingStatus(DataLoadingStatus.Loaded);
          }
          else{
              setDataLoadingStatus(DataLoadingStatus.Error);
          }
        });
  }, [setDataLoadingStatus, props.setFoodLog]);

  const loadMoreFoodLogs = useCallback(() => {
      setLoadedEntriesAmount(value => value+20);
      fetchFoodLogs(loadedEntriesAmount + 20);
  }, [loadedEntriesAmount, setLoadedEntriesAmount, fetchFoodLogs]);

  if (dataLoadingStatus === DataLoadingStatus.NotLoaded) {
      setDataLoadingStatus(DataLoadingStatus.Loading);
      fetchFoodLogs(loadedEntriesAmount);
  }

  const memoizedFoodLogGroups = useMemo(() => {
        return Object.entries(
          props.foodLog.reduce<Record<string, UserMeal[]>>((acc, item) => {
            const date = item.created_at.split("T")[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(item);
            return acc;
          }, {})
        )
          .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
          .map(([date, items]) => ({ date, items }));
    }, [props.foodLog]);

  if (dataLoadingStatus !== DataLoadingStatus.Loaded) return (
      <div className="empty-page">
          <h3 className="empty-page-title">{dataLoadingStatus === DataLoadingStatus.Error? "Error loading your profile" : "Loading your profile..."}</h3>
      </div>
  );

    return (
        <div className="base-page">
            <h2>Tracked Meals</h2>
            <div style={{display: "flex", flexDirection: "row", gap: 10, paddingLeft: 15, paddingRight: 15}}>
                <button onClick={() => navigate('/foodlog/add')} className="button green-button" style={{flex: 1}}><FontAwesomeIcon icon={faKeyboard}/></button>
                <button onClick={() => navigate('/foodlog/photo')} className="button green-button" style={{flex: 1}}><FontAwesomeIcon icon={faCamera}/></button>
                <button onClick={() => navigate('/foodlog/search')} className="button green-button" style={{flex: 1}}><FontAwesomeIcon icon={faMagnifyingGlassPlus}/></button>
            </div>
            <div>
                {memoizedFoodLogGroups.map(group => <FoodLogEntryGroup key={group.date} date={group.date} items={group.items} setLogs={props.setFoodLog} setSelectedTemplate={props.setSelectedTemplate}/>)}
                {props.foodLog.length === loadedEntriesAmount ? <button onClick={loadMoreFoodLogs} className="button green-button">Load More</button> : <></>}
            </div>
        </div>
    );
};

export default FoodLogPageMain;
