import React, { useEffect, useState } from "react";
import "./settings.css";

const BrowserSettingsPage = () => {
  const [darkMode, setDarkMode] = useState("light");
  const [showNotification, setShowNotification] = useState(false);

  const toggleTheme = (e) => {
    const newTheme = e.target.checked ? "dark" : "light";
    document.querySelector("#root").setAttribute("data-theme", newTheme);

    setDarkMode(newTheme);
    window.localStorage.setItem("theme", newTheme);
  };
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const notifySetting = JSON.parse(localStorage.getItem("notify"));
    if (storedTheme) {
      document.querySelector("#root").setAttribute("data-theme", storedTheme);
      setDarkMode(storedTheme);
    }
    if (notifySetting) {
      setShowNotification(notifySetting);
    }
  }, []);

  const saveSettings = () => {
    window.localStorage.setItem(
      "theme",
      document.querySelector("#root").getAttribute("data-theme")
    );
    window.localStorage.setItem("notify", JSON.stringify(showNotification));
    new Notification("Settings saved", {
      body: "Your settings have been saved successfully.",
    });
  };

  const toggleNotification = (e) => {
    setShowNotification(e.target.checked);
  };
  return (
    <div className="settings-page">
      <h2>Browser Settings</h2>
      <div className="setting-controls">
        <div className="setting-option">
          <label htmlFor="notifications">Enable Notifications:</label>
          <input
            type="checkbox"
            id="notifications"
            checked={showNotification}
            onChange={toggleNotification}
          />
        </div>
        <div className="setting-option">
          <label htmlFor="darkMode">Dark Mode:</label>
          <input
            type="checkbox"
            id="darkMode"
            onChange={toggleTheme}
            checked={darkMode === "light" ? false : true}
          />
        </div>

        <button className="save-button" onClick={saveSettings}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default BrowserSettingsPage;
