import React from "react";
import { SET_TABS } from "../../constants/renderer/actions";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Tab from "./Tab.jsx";
import { mergeChannel, RE_ORDER_VIEWS } from "../../constants/global/channels";
const TabsList = ({ tabs, tabsDispatch, workspaceId }) => {
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

  return (
    <div className="workspace-tabs">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId={`workspace-${workspaceId}`}>
          {(provided) => (
            <div
              className="tabs-container"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tabs.map(
                (
                  {
                    id,
                    active,
                    title,
                    url,
                    type,
                    loading,
                    fail,
                    workspaceId: tabWorkspaceId,
                  },
                  index
                ) => (
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
                          workspaceId={tabWorkspaceId || workspaceId}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TabsList;
