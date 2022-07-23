import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoMdRefresh } from "react-icons/io";
const navigationControls = () => {
  return [
    {
      id: "navigation-controls-back",
      icon: <FiChevronLeft fontSize="20" />,
      click: () => {
        const currentView = document.querySelector(".active-webview");
        if (currentView?.canGoBack()) {
          currentView?.goBack();
        }
      },
    },
    {
      id: "navigation-controls-forward",
      icon: <FiChevronRight fontSize="20" />,
      click: () => {
        const currentView = document.querySelector(".active-webview");
        if (currentView?.canGoForward()) {
          currentView?.goForward();
        }
      },
    },
    {
      id: "navigation-controls-reload",
      icon: <IoMdRefresh fontSize="20" />,
      click: () => {
        const currentView = document.querySelector(".active-webview");
        currentView?.reload();
      },
    },
  ];
};

const NavigationControls = () => {
  const renderNavigationControls = navigationControls().map(
    ({ id, icon, click }) => (
      <button key={id} id={id} onClick={click}>
        {icon}
      </button>
    )
  );
  return <div id="navigation-controllers">{renderNavigationControls}</div>;
};

export default NavigationControls;
