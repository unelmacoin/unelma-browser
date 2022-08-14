import React, { useState } from "react";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { ImBin } from "react-icons/im";
import { REMOVE_PASSWORD } from "../../../constants/renderer/actions";
import { handleFavicon } from "../../utils/handleFavicon";
import "./password-item.css";
const PasswordItem = ({
  id,
  site,
  username,
  password: pass,
  passwordsDispatch,
}) => {
  const [password, setPassword] = useState(pass);
  const [toggled, setToggled] = useState(false);
  const handleToggle = () => {
    setToggled((v) => !v);
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const handleRemove = () => {
    passwordsDispatch({
      type: REMOVE_PASSWORD,
      payload: {
        id,
      },
    });
  };
  return (
    <div id="password-item">
      <img src={handleFavicon(site)} />
      <button className="site">{site?.length > 30 ? `${site?.slice(0,30)}...`:site}</button>
      <p>{username}</p>
      <input
        type={!toggled ? "password" : "text"}
        value={password}
        onChange={handleChangePassword}
      />
      <button onClick={handleToggle}>
        {!toggled ? <BsEyeFill /> : <BsEyeSlashFill />}
      </button>
      <button>
        <ImBin fontSize="15" color="#f56a6a" onClick={handleRemove} />
      </button>
    </div>
  );
};

export default PasswordItem;
