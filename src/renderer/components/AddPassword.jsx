import React from "react";
import "../css/AddPassword.css";

const AddPassword = ({ hideModal }) => {
  return (
    <div className="backdrop">
      <div className="addPassword-container">
        <button className="close-btn" onClick={hideModal}>
          &times;
        </button>
        <div className="addPassword__header">Add Password</div>
        <form className="addPassword__form">
          <div className="addPassword__inputset">
            <label htmlFor="siteName">Website</label>
            <input
              className="addPassword__input"
              type="url"
              name="site"
              id="site"
              placeholder="URL address"
              required
            />
          </div>

          <div className="addPassword__inputset">
            <label htmlFor="siteName">Username</label>
            <input
              className="addPassword__input"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              required
            />
          </div>

          <div className="addPassword__inputset">
            <label htmlFor="siteName">Password</label>
            <input
              className="addPassword__input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              required
            />
          </div>
          <div className="btn-set">
            <button className="btnSave">Save</button>
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
