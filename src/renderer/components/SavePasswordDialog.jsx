import React, { useState } from "react";
import { ADD_PASSWORD } from "../../constants/renderer/actions";
import uniqid from "uniqid";
const SavePasswordDialog = ({
  info,
  setLoginDialogInfo,
  passwordsDispatch,
}) => {
  const [username, setUsername] = useState(info.username);
  const [password, setPassword] = useState(info.password);
  const handleSubmit = (e) => {
    e.preventDefault();
    passwordsDispatch({
      type: ADD_PASSWORD,
      payload: {
        password: {
          id: uniqid(),
          ...info,
        },
      },
    });
    setLoginDialogInfo(null);
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
