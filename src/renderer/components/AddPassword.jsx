import React, { useState } from "react";
import { mergeChannel, SAVE_LOGIN_INFO } from "../../constants/global/channels";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import "../css/AddPassword.css";

const AddPassword = ({ hideModal }) => {
  const [textInput, setTextInput] = useState({
    site: "",
    username: "",
    password: "",
  });
  const [hidePassword, setHidePassword] = useState(true);

  const handleInputChange = (e) => {
    setTextInput({ ...textInput, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => {
    setHidePassword(!hidePassword);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    window.api.send(mergeChannel(SAVE_LOGIN_INFO, window.id), textInput);
    setTimeout(() => hideModal(), 1000); // Hides the modal after 1 second, allows enough time to save url/password
  };
  return (
    <div className="backdrop">
      <div className="addPassword-container">
        <button className="close-btn" onClick={hideModal}>
          &times;
        </button>
        <div className="addPassword__header">Add Password</div>
        <form className="addPassword__form" onSubmit={handleSavePassword}>
          <div className="addPassword__inputset">
            <label htmlFor="site">Website</label>
            <input
              className="addPassword__input"
              type="url"
              name="site"
              id="site"
              value={textInput.site}
              placeholder="URL address"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="addPassword__inputset">
            <label htmlFor="username">Username or email</label>
            <input
              className="addPassword__input"
              type="text"
              name="username"
              id="username"
              value={textInput.username}
              placeholder="Username or email"
              required
              onChange={handleInputChange}
            />
          </div>

          <div className="addPassword__inputset">
            <label htmlFor="password">Password</label>
            <div className="psw">
              <input
                className="addPassword__input"
                type={hidePassword ? "password" : "text"}
                name="password"
                id="password"
                value={textInput.password}
                placeholder="Password"
                required
                onChange={handleInputChange}
              />
              <button className="visibility-icon" onClick={handleShowPassword}>
                {hidePassword ? <BsEyeFill /> : <BsEyeSlashFill />}
              </button>
            </div>
          </div>
          <div className="btn-set">
            <button className="btnSave" type="submit">
              Save
            </button>
            <button className="btnCancel" type="reset" onClick={hideModal}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPassword;
