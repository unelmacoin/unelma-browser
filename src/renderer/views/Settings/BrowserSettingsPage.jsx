import React from 'react';
import './settings.css'

const BrowserSettingsPage = () => {
  return (
    <div className="settings-page">
      <h2>Browser Settings</h2>
      <div className="setting-option">
        <label htmlFor="cookies">Enable Cookies:</label>
        <input type="checkbox" id="cookies" />
      </div>
      <div className="setting-option">
        <label htmlFor="notifications">Enable Notifications:</label>
        <input type="checkbox" id="notifications" />
      </div>
      <div className="setting-option">
        <label htmlFor="darkMode">Dark Mode:</label>
        <input type="checkbox" id="darkMode" />
      </div>
      <button className="save-button">Save Settings</button>
    </div>
  );
};

export default BrowserSettingsPage;
