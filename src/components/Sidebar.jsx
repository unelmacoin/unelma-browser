import React, { useState } from 'react'
import BookmarkBtn from "./BookmarkBtn.jsx";
import LocationForm from "./LocationForm.jsx";
import Menu from "./Menu.jsx";
import MenuButton from "./MenuButton.jsx";
import NavigationControls from "./NavigationControls.jsx";
import TabsList from "./TabsList.jsx";
import WindowControllers from "./WindowControllers.jsx";

const Sidebar = ({
  tabs,
  tabsDispatch,
  openSidebar,
  setOpenSidebar,
  setBookmarks,
  bookmarks
}) => {
  const [menu, setMenu] = useState(false);
  return (
    <div id="app-sidebar" className={`${!openSidebar && "toggled-sidebar"}`}>
      <div id="controllers">
        <MenuButton setMenu={setMenu} />
        <WindowControllers
          setOpenSidebar={setOpenSidebar}
          openSidebar={openSidebar}
        />
        <BookmarkBtn
          tabs={tabs}
          setBookmarks={setBookmarks}
          bookmarks={bookmarks}
        />
        <NavigationControls tabs={tabs} />
      </div>
      <LocationForm tabs={tabs} tabsDispatch={tabsDispatch} />
      <Menu
        menu={menu}
        setMenu={setMenu}
        tabsDispatch={tabsDispatch}
        tabs={tabs}
      />
      <TabsList tabs={tabs} tabsDispatch={tabsDispatch} />
    </div>
  );
};

export default Sidebar
