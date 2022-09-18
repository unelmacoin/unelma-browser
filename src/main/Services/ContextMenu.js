const contextMenu = require("electron-context-menu");
export class ContextMenu {
  constructor(contents, addWindow) {
    contextMenu({
      window: contents,
      showInspectElement: true,
      prepend: () => [
        {
          label: "New window",
          click: () => {
            addWindow();
          },
        },
      ],
    });
  }
}
