import React, { useState } from "react";
import { UserProfile, ModifyUserProfileResp, Intolerance } from "../../Utils/response-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

type Props = {
  label: string;
  value: Intolerance[];
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | undefined>>
  addFunc: (newIntolerance: string) => Promise<ModifyUserProfileResp>;
  removeFunc: (intoleranceId: number) => Promise<ModifyUserProfileResp>;
};

function IntolerancesAttributeDisplay({
  label,
  value,
  setUserProfile,
  addFunc,
  removeFunc,
}: Props) {
  const [adding, setAdding] = useState(false);
  const [newIntolerance, setNewIntolerance] = useState("");

  const handleAdd = async () => {
    const trimmed = newIntolerance.trim();
    if (!trimmed) return;

    try {
      const resp = await addFunc(trimmed);
      if (resp.success && resp.profile) {
        setUserProfile(resp.profile);
        setNewIntolerance("");
        setAdding(false);
      } else {
        alert(resp.message || "Failed to add intolerance");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding intolerance");
    }
  };

  const handleRemove = async (id: number) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Remove this intolerance?")) return;
    try {
      const resp = await removeFunc(id);
      if (resp.success && resp.profile) {
        setUserProfile(resp.profile);
      } else {
        alert(resp.message || "Failed to remove intolerance");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing intolerance");
    }
  };

  return (
    <div className="attribute-row" style={{ flexDirection: "column", alignItems: "flex-start" }}>
      <div style={{ display: "flex", width: "100%", justifyContent: "space-between" }}>
        <span className="attribute-label">{label}:</span>
        {!adding && (
          <button
            className="icon-button"
            onClick={() => setAdding(true)}
            title="Add intolerance"
          >
            <FontAwesomeIcon icon={faPlus} />
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: 8, width: "100%" }}>
        {value && value.length > 0 ? (
          value.map((intol) => (
            <div
              key={intol.intolerance_id}
              style={{
                display: "flex",
                alignItems: "center",
                background: "#24344a",
                padding: "4px 8px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                color: "#d8e1ee",
              }}
            >
              <span>{intol.intolerance_name}</span>
              <button
                onClick={() => handleRemove(intol.intolerance_id)}
                className="icon-button"
                style={{ marginLeft: 6, color: "#f66" }}
                title="Remove intolerance"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          ))
        ) : (
          <span style={{ opacity: 0.7 }}>No intolerances</span>
        )}
      </div>

      {adding && (
        <div style={{ marginTop: 8, width: "100%", display: "flex", gap: 6 }}>
          <input
            className="attribute-input"
            type="text"
            placeholder="Enter intolerance name..."
            value={newIntolerance}
            onChange={(e) => setNewIntolerance(e.target.value)}
            style={{ flex: 1 }}
          />
          <button className="save-button" onClick={handleAdd}>Add</button>
          <button className="cancel-button" onClick={() => setAdding(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default IntolerancesAttributeDisplay;
