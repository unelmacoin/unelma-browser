const contextMenu = require("electron-context-menu");
const { createWindow } = require("./window");
module.exports = {
  addContextMenu: (contents) =>
    contextMenu({
      window: contents,
      showInspectElement: true,
      prepend: () => [
        {
          label: "New window",
          click: () => {
            createWindow();
          },
        },
      ],
    }),
};
