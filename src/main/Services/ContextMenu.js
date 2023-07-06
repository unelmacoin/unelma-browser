const { dialog } = require("electron");
const contextMenu = require("electron-context-menu");
const { app } = require('electron');
const path = require('path');
const { net } = require('electron');
const fs = require("fs");
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
              defaultPath: path.join(app.getPath('home'), (parameters.title || 'image') + '.png'),
            }).then(result => {
              if (!result.canceled) {
                const url = parameters.srcURL;
                const filePath = result.filePath;
                download(url, filePath);
              }
            });
          }
        },
      ]
      
 
    });
  }
}


function download(url, filePath) {
  if (url.startsWith('data:')) {
    const base64Data = url.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(filePath, buffer);
  } else {
    const request = net.request(url);
    request.on('response', (response) => {
      response.on('data', (chunk) => {
        fs.appendFileSync(filePath, chunk);
      });
    });
    request.end();
  }
}

module.exports = {ContextMenu}
