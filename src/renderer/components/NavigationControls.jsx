import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { IoMdRefresh } from "react-icons/io";
import { GO_BACK, GO_FORWARD, mergeChannel, RELOAD } from "../../constants/global/channels";
const navigationControls = () => {
  return [
    {
      id: "navigation-controls-back",
      icon: <FiChevronLeft fontSize="20" />,
      click: () => {
        window.api.send(mergeChannel(GO_BACK, window.id));
      },
    },
    {
      id: "navigation-controls-forward",
      icon: <FiChevronRight fontSize="20" />,
      click: () => {
         window.api.send(mergeChannel(GO_FORWARD, window.id));
      },
    },
    {
      id: "navigation-controls-reload",
      icon: <IoMdRefresh fontSize="20" />,
      click: () => {
        window.api.send(mergeChannel(RELOAD, window.id));
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
