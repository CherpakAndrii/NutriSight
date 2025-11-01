import React, { useState } from "react";
import { UserProfile, ModifyUserProfileResp } from "../../Utils/response-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

type EnumOption<T> = { label: string; value: T };

type EnumAttributeDisplayProps<T> = {
  label: string;
  value: T;
  options: EnumOption<T>[];
  updateFunc: (newValue: T) => Promise<ModifyUserProfileResp>;
  setUserProfile: (profile: UserProfile | undefined) => void;
};

function EnumAttributeDisplay<T>({
  label,
  value,
  options,
  setUserProfile,
  updateFunc,
}: EnumAttributeDisplayProps<T>) {
  const [editing, setEditing] = useState(false);
  const [selectedValue, setSelectedValue] = useState<T>(value);

  const handleSave = async () => {
    if (selectedValue === undefined) return;
    try {
      const resp = await updateFunc(selectedValue);
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
              <select
                  className="attribute-input"
                  value={String(selectedValue)}
                  onChange={(e) => setSelectedValue(Number(e.target.value) as T)}
              >
                {options.map((opt) => (
                    <option key={String(opt.value)} value={String(opt.value)}>
                      {opt.label}
                    </option>
                ))}
              </select>
              <div className="attribute-buttons">
                <button className="save-button" onClick={handleSave}>Save</button>
                <button className="cancel-button" onClick={() => {
                  setSelectedValue(value);
                  setEditing(false);
                }}>Cancel
                </button>
              </div>
            </>
        ) : (
            <>
          <span className="attribute-value">
            {options.find((opt) => opt.value === value)?.label ?? ""}
          </span>
              <button className="icon-button" onClick={() => setEditing(true)}>
                <FontAwesomeIcon icon={faPen}/>
              </button>
            </>
        )}
      </div>
  );
}

export default EnumAttributeDisplay;
