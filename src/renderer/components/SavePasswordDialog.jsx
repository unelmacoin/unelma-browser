import React, { useState } from "react";
import { mergeChannel, SAVE_LOGIN_INFO } from "../../constants/global/channels";

const SavePasswordDialog = ({ info, setLoginDialogInfo }) => {
  const [username, setUsername] = useState(info.username);
  const [password, setPassword] = useState(info.password);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginDialogInfo(null);
    window.api.send(mergeChannel(SAVE_LOGIN_INFO, window.id), info);
  };
  const handleCancel = () => {
    setLoginDialogInfo(null);
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  return (
    <form id="savePasswordDialog" onSubmit={handleSubmit}>
      <h2>Save password !</h2>
      <input
        type="text"
        placeholder="username or email"
        value={username}
        onChange={handleUsernameChange}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={handlePasswordChange}
      />
      <div>
        <button type="submit" id="save">
          Save
        </button>
        <button type="button" id="never" onClick={handleCancel}>
          Never
        </button>
      </div>
    </form>
  );
};

export default SavePasswordDialog;
