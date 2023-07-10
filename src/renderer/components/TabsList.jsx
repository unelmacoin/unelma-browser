import React from "react";
import { FaPlus } from "react-icons/fa";
import { ADD_TAB, SET_TABS } from "../../constants/renderer/actions";
import { defaultTab } from "../utils/tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tab from "./Tab.jsx";
import {
  ADD_VIEW,
  mergeChannel,
  RE_ORDER_VIEWS,
} from "../../constants/global/channels";
const TabsList = ({ tabs, tabsDispatch }) => {
  const handleAddTab = () => {
    const newTab = defaultTab(window.id);
    window.api.send(mergeChannel(ADD_VIEW, window.id), { ...newTab });
    tabsDispatch({
      type: ADD_TAB,
      payload: {
        tab: { ...newTab },
      },
    });
  };
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(tabs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    tabsDispatch({
      type: SET_TABS,
      payload: {
        tabs: items,
      },
    });
    window.api.send(
      mergeChannel(RE_ORDER_VIEWS, window.id),
      items.map(({ id }) => id)
    );
  }
  const renderTabs = () =>
    tabs.map(({ id, active, title, url, type, loading, fail }, index) => (
      <Draggable key={id} draggableId={`${id}`} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Tab
              id={id}
              active={active}
              title={title}
              tabsDispatch={tabsDispatch}
              loading={loading}
              url={url}
              type={type}
              fail={fail}
            />
          </div>
        )}
      </Draggable>
    ));

  return (
    <div id="tabs">
      <button id="add-tab" onClick={handleAddTab}>
        <FaPlus />
        <span>New Tab</span>
      </button>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="characters">
          {(provided) => (
            <div
              id="actual-tabs"
              style={{ maxHeight: "450px" }}
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {renderTabs()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>      
    </div>
  );
};

export default TabsList;
