import React, { useState } from "react";
import { UserProfile, ModifyUserProfileResp } from "../../Utils/response-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

type StringAttributeDisplayProps = {
  label: string;
  value?: string;
  updateFunc: (newValue: string) => Promise<ModifyUserProfileResp>;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | undefined>>;
};

function StringAttributeDisplay({
  label,
  value,
  updateFunc,
  setUserProfile
}: StringAttributeDisplayProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState<string>(value ?? "");

  const handleSave = async () => {
    try {
      const resp = await updateFunc(inputValue);
      if (resp.success && resp.profile) {
        setUserProfile(resp.profile);
        setEditing(false);
      } else {
        alert(resp.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating attribute");
    }
  };

  return (
      <div className="attribute-row">
        <span className="attribute-label">{label}:</span>

        {editing ? (
            <>
              <input
                  className="attribute-input"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
              />
              <div className="attribute-buttons">
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="cancel-button" onClick={() => {
                    setInputValue(value as any ?? "");
                    setEditing(false);
                }}>Cancel</button>
              </div>
            </>
        ) : (
            <>
              <span className="attribute-value">{String(value ?? "")}</span>
              <button className="icon-button" onClick={() => setEditing(true)}>
                <FontAwesomeIcon icon={faPen}/>
              </button>
            </>
        )}
      </div>
  );
}

export default StringAttributeDisplay;
