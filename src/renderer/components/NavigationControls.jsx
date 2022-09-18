import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoMdRefresh } from "react-icons/io";
const navigationControls = () => {
  return [
    {
      id: "navigation-controls-back",
      icon: <FiChevronLeft fontSize="20" />,
      click: () => {
        window.api.send("go-back" + window.id);
      },
    },
    {
      id: "navigation-controls-forward",
      icon: <FiChevronRight fontSize="20" />,
      click: () => {
        window.api.send("go-forward" + window.id);
      },
    },
    {
      id: "navigation-controls-reload",
      icon: <IoMdRefresh fontSize="20" />,
      click: () => {
        window.api.send("reload" + window.id);
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
