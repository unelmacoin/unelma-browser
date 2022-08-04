import React from "react";
import { FaPlus } from "react-icons/fa";
import { ADD_TAB, SET_TABS } from "../../constants/renderer/actions";
import { defaultTab } from "../utils/tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tab from "./Tab.jsx";
const TabsList = ({ tabs, tabsDispatch }) => {
  const handleAddTab = () => {
    tabsDispatch({
      type: ADD_TAB,
      payload: {
        tab: { ...defaultTab(window.id) },
      },
    });
  };
  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(tabs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    tabsDispatch({ type: SET_TABS, tabs: items });
  }
  const renderTabs = () =>
    tabs.map(({ id, active, title, url, type, loading }, index) => (
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
            />
          </div>
        )}
      </Draggable>
    ));

  return (
    <div id="tabs">
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
      <button id="add-tab" onClick={handleAddTab}>
        <FaPlus />
        <span>New Tab</span>
      </button>
    </div>
  );
};

export default TabsList;
