const { dialog } = require("electron");
const contextMenu = require("electron-context-menu");
 class ContextMenu {
  constructor(contents, addWindow) {
    contextMenu({
      window: contents,
      showInspectElement: true,
      prepend: () => [
        {
          label: "New window",
          click: () => addWindow(),
        },
      ],
      prepend: (defaultActions, parameters, browserWindow) => [
        {
          label: 'Save Image As ...',
          visible: parameters.mediaType === 'image',
          click: () => {
            dialog.showSaveDialog(browserWindow, {
              title: 'Save As',
              defaultPath: '~/'
            })
          }
        },
      ]
    });
  }
}

module.exports = {ContextMenu}
