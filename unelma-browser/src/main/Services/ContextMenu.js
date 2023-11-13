const { dialog ,app, net} = require("electron");
const contextMenu = require("electron-context-menu");
const path = require('path');
const fs = require("fs");
 class ContextMenu {
  constructor(contents, addWindow) {
    contextMenu({
      window: contents,
      showInspectElement: true,
      prepend: (defaultActions, parameters, browserWindow) => [
        {
          label: "New window",
          click: () => addWindow(),
        },
        {
          label: 'Save Image As ...',
          visible: parameters.mediaType === 'image',
          click: async () => {
            const result = await dialog.showSaveDialog(browserWindow, {
              title: 'Save Image As',
              defaultPath: path.join(app.getPath('home'), (parameters.title || 'image') + '.png'),
              filters: [
                { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'svf', 'svg', 'gif','webp', 'tiff'] }
              ]
            });

            if (!result.canceled) {
              let filePath = result.filePath;
              const extension = path.extname(filePath);
              if (!extension) {
                filePath += '.png';
              }

              const url = parameters.srcURL;
              download(url, filePath);
            }
          }
        },
        {
          label: 'Print',
          accelerator: process.platform === 'darwin' ? 'Command+P' : 'Ctrl+P',
          click: () => {

            try {
              contents.print({
                silent: false,
                printBackground: true,
              });
            } catch (error) {
              console.log(error)
            }
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
