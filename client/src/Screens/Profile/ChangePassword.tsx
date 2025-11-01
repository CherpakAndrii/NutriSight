import React, { useState } from "react";
import { AuthProvider } from "../../Utils/enums";
import { updateProfilePassword } from "../../Utils/queries";

type ChangePasswordProps = { auth_provider: AuthProvider };

const ChangePassword: React.FC<ChangePasswordProps> = ({ auth_provider }) => {
  const [current, setCurrent] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [repeatPwd, setRepeatPwd] = useState("");

  const handleChange = async () => {
    if (newPwd !== repeatPwd) {
      alert("New passwords do not match");
      return;
    }

    try {
      const old_pwd = auth_provider === AuthProvider.Google ? undefined : current;
      const resp = await updateProfilePassword(old_pwd, newPwd);
      if (resp.success) {
        alert("Password changed successfully");
        setCurrent(""); setNewPwd(""); setRepeatPwd("");
      } else {
        alert(resp.message || "Failed to change password");
      }
    } catch (err) {
      console.error(err);
      alert("Error changing password");
    }
  };

  return (
    <div style={{ marginTop: 12, marginBottom: 12 }}>
      <h3>Change Password</h3>
      {auth_provider !== AuthProvider.Google && (
        <div className="attribute-row">
          <span className="attribute-label">Current Password:</span>
          <input className="attribute-input" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        </div>
      )}
      <div className="attribute-row">
        <span className="attribute-label">New Password:</span>
        <input className="attribute-input" type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
      </div>
      <div className="attribute-row">
        <span className="attribute-label">Repeat New Password:</span>
        <input className="attribute-input" type="password" value={repeatPwd} onChange={(e) => setRepeatPwd(e.target.value)} />
      </div>
      <button onClick={handleChange} className="button green-button">Change Password</button>
    </div>
  );
};

export default ChangePassword;
