// Libs
const electron = require('electron');
const { BrowserWindow, ipcMain } = electron;
const appConfig = require('electron-settings');
const previewWindowID = appConfig.get('previewWindowID');
const previewWindow = BrowserWindow.fromId(previewWindowID);
const mainWindowID = appConfig.get('mainWindowID');
const mainWindow = BrowserWindow.fromId(mainWindowID);
const PDFWindow = require('electron-pdf-window');

ipcMain.on('preview-document', (event, docData) =>
{
  // Show & Focus
  // previewWindow.show();
  // previewWindow.focus();
  // previewWindow.webPreferences.plugins = true;
  // create PDF window
  const pdfWindow = new PDFWindow(
  {
    width: 800,
    height: 600
  })

  PDFWindow.addSupport(pdfWindow);

  const path = require('path');
  const mkdirp = require('mkdirp');
  const appDir = (electron.app || electron.remote.app).getAppPath();

  mkdirp(appDir + '/data/', (err) =>
  {
    if(err)
    {
      return console.log('error: %s', err.message);
    }
    
    const pdf_path = path.join(appDir, '/data/temp.pdf');
    // const pdf_path = path.join(appDir, `temp.pdf`);
    // const decodedBase64 = require('base64topdf').base64Decode(docData.file.split(';base64,').pop(), pdf_path);
    require('fs').writeFile(pdf_path, docData.file.split(';base64,').pop(), {encoding: 'base64'}, (err) =>
    {
      console.log('created PDF document for PDF viewer');
      pdfWindow.loadURL(pdf_path);
    });
  });
  // Pass Data
  // previewWindow.webContents.send('update-document-preview', docData);
});

ipcMain.on('model-to-pdf', (event, data, type) =>
{
  // Show & Focus
  // previewWindow.show();
  // previewWindow.focus();
  // Pass Data
  previewWindow.webContents.send('is-exporting', true); // makes viewer generate PDF
  previewWindow.webContents.send('update-'+type+'-preview', data);
});

ipcMain.on('preview-quote', (event, quoteData) =>
{
  // Show & Focus
  previewWindow.show();
  previewWindow.focus();
  // Pass Data
  previewWindow.webContents.send('update-quote-preview', quoteData);
});

ipcMain.on('preview-job-card', (event, jobData) =>
{
  // Show & Focus
  previewWindow.show();
  previewWindow.focus();
  // Pass Data
  previewWindow.webContents.send('update-job-card-preview', jobData);
});

ipcMain.on('preview-invoice', (event, invoiceData) =>
{
  // Show & Focus
  previewWindow.show();
  previewWindow.focus();
  // Pass Data
  previewWindow.webContents.send('update-invoice-preview', invoiceData);
});

ipcMain.on('preview-po', (event, poData) =>
{
  // Show & Focus
  previewWindow.show();
  previewWindow.focus();
  // Pass Data
  previewWindow.webContents.send('update-po-preview', poData);
});

// Update Preview window Config
ipcMain.on('update-preview-window', (event, newConfigs) =>
{
  previewWindow.webContents.send('update-preview-window', newConfigs);
});

// Change UI language for Preview Window
ipcMain.on('change-preview-window-language', (event, newLang) =>
{
  previewWindow.webContents.send('change-preview-window-language', newLang);
});

// Change invoice profile
ipcMain.on('change-preview-window-profile', (event, newProfile) =>
{
  previewWindow.webContents.send('change-preview-window-profile', newProfile);
});

// Save configs to invoice
ipcMain.on('save-configs-to-invoice', (event, invoiceID, configs) =>
{
  mainWindow.webContents.send('save-configs-to-invoice', invoiceID, configs);
});
