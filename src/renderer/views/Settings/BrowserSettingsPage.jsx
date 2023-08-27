import React, { useEffect, useState } from "react";
import "./settings.css";

const BrowserSettingsPage = () => {
  const [darkMode, setDarkMode] = useState('light');

  console.log('"""""""""""""""""""""""""""""""""""""""',darkMode,'****************************************document.body')

  const toggleTheme = (e) =>{
    const newTheme = e.target.checked ? 'dark' : 'light';
    console.log(newTheme)
    document.querySelector('body').setAttribute('data-theme', newTheme);

  setDarkMode(newTheme)
  window.localStorage.setItem('theme', newTheme);

  }

  useEffect(() => {
    // Retrieve the user's preferred theme from browser storage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      document.querySelector('body').setAttribute('data-theme', storedTheme);
      setDarkMode(storedTheme);
    }
  }, []);

  const saveSettings =() => {
   window.localStorage.setItem('theme',  document.body.getAttribute("data-theme"));
  }
  return (
    <div className="settings-page">
      <h2>Browser Settings</h2>
      <div className="setting-controls">
      <div className="setting-option">
        <label htmlFor="notifications">Enable Notifications:</label>
        <input type="checkbox" id="notifications" />
      </div>
      <div className="setting-option">
        <label htmlFor="darkMode">Dark Mode:</label>
        <input type="checkbox" id="darkMode"  onChange={toggleTheme} checked={darkMode === 'light' ? false : true} />
      </div>

      <button className="save-button" onClick={saveSettings}>Save Settings</button>
      </div>
    </div>
  );
};

export default BrowserSettingsPage;
