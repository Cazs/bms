// Libs
const { BrowserWindow, ipcMain, shell } = require('electron');
const ipc = require('electron').ipcRenderer;
const appConfig = require('electron-settings');
const path = require('path');
const fs = require('fs');

const mainWindowID = appConfig.get('mainWindowID');
const mainWindow = BrowserWindow.fromId(mainWindowID);

ipcMain.on('save-pdf', (event, docId) =>
{
  const exportDir = appConfig.get('invoice.exportDir');
  const pdfPath = path.join(exportDir, `${docId}.pdf`);
  const win = BrowserWindow.fromWebContents(event.sender);

  const printOptions =
  {
      landscape: false,
      printBackground: true,
      pageSize: 'A4',
      marginsType: 10
      // printBackground: true,
      // printSelectionOnly: false
    };
  // if (appConfig.has('general.printOptions'))
  // {
  //   printOptions = appConfig.get('general.printOptions');
  // } else
  // {
  //   printOptions = {
  //     landscape: false,
  //     marginsType: 0,
  //     printBackground: true,
  //     printSelectionOnly: false
  //   };
  // }

  win.webContents.printToPDF(printOptions, (error, data) =>
  {
    if (error) throw error;
    fs.writeFile(pdfPath, data, error =>
    {
      if (error)
      {
        throw error;
      }
      // if (appConfig.get('general.previewPDF'))
      // {
      //   // Open the PDF with default Reader
      //   shell.openExternal('file://' + pdfPath);
      // }
      // Open the PDF with default Reader
      shell.openExternal('file://' + pdfPath);

      // Show notification
      win.webContents.send('pdf-exported',
      {
        title: 'PDF Exported',
        body: 'Click to reveal file.',
        location: pdfPath,
      });

      mainWindow.webContents.send('email-document-ready', docId, pdfPath);
    });
  });
});

ipcMain.on('reveal-file', (event, location) =>
{
  shell.showItemInFolder(location);
});
