// Libs
const { BrowserWindow, ipcMain } = require('electron');
const appConfig = require('electron-settings');
const previewWindowID = appConfig.get('previewWindowID');
const previewWindow = BrowserWindow.fromId(previewWindowID);
const mainWindowID = appConfig.get('mainWindowID');
const mainWindow = BrowserWindow.fromId(mainWindowID);

// import {emailDocument} from '../app/helpers/DataManager';
const PDFWindow = require('electron-pdf-window');
// let is_emailing = false;

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
  const pdf_path = path.resolve( 'static/temp.pdf');
  // const decodedBase64 = require('base64topdf').base64Decode(docData.file.split(';base64,').pop(), pdf_path);
  require('fs').writeFile(pdf_path, docData.file.split(';base64,').pop(), {encoding: 'base64'}, (err) =>
  {
    console.log('created PDF document for PDF viewer');
    pdfWindow.loadURL(pdf_path);
  });
  // Pass Data
  // previewWindow.webContents.send('update-document-preview', docData);
});

// ipcMain.on('email-quote', (event, emailData) =>
// {
//   is_emailing = true;
//   // Show & Focus
//   previewWindow.show();
//   previewWindow.focus();

//   console.log(emailData.quote);

//   // update preview window in the background
//   previewWindow.webContents.send('update-quote-preview', emailData.quote);
// });

// ipcMain.on('updated-preview', (event, pdfData) =>
// {
//   console.log('updated quote preview');

//   if(is_emailing)
//   {
//     let printOptions;
//     if (appConfig.has('general.printOptions'))
//     {
//       printOptions = appConfig.get('general.printOptions');
//     } else
//     {
//       printOptions =
//       {
//         landscape: false,
//         marginsType: 0,
//         printBackground: true,
//         printSelectionOnly: false,
//       };
//     }

//     previewWindow.webContents.printToPDF(printOptions, (error, data) =>
//     {
//       if (error) throw error;
      
//       const path = require('path').resolve('static/test.pdf');
//       const fs = require('fs');

//       fs.writeFile(path, data, error =>
//       {
//         if (error)
//         {
//           throw error;
//         }
        
//         console.log('Generated PDF document');

//         const file_data = fs.readFileSync(path);
//         const file_base64_str =
//         `data:application/pdf;base64,${file_data.toString('base64')}`;

//         // const file =
//         // {
//         //   filename: emailData.quote._id,
//         //   content_type: 'application/pdf',
//         //   file: file_data.toString('base64') // file_base64_str.split('base64,').pop()
//         // }
//         // import  * as DataManager from '../app/helpers/DataManager';
//         // require('../app/helpers/DataManager')
//         // emailDocument(emailData.dispatch, Object.assign(emailData.quote, { metafile: file }), '/quote/mailto')
//         // .then(response => console.log('emailed PDF document', response));

//         // const UIActions = require('../app/actions/ui');
//         // const ACTION_TYPES = require('../app/constants/actions');

//         // const HttpClient = require('axios').create(
//         // {
//         //     headers:
//         //     {
//         //       quote_id: emailData.quote_id,
//         //       destination: emailData.destination,
//         //       subject: emailData.subject,
//         //       message : emailData.message,
//         //       session_id : emailData.session_id,
//         //       'Content-Type': 'application/json'
//         //     }
//         // });
//         // const new_email_obj =
//         // {
//         //   quote_id: emailData.quote_id,
//         //   destination: emailData.destination,
//         //   subject: emailData.subject,
//         //   message : emailData.message,
//         //   metafile: file
//         // };

//         // return HttpClient.post('http://127.0.0.1:8080/quote/mailto', file)
//         //                 .then(response =>
//         //                   emailData.then.apply(response))
//         //                 .catch(err => 
//         //                   emailData.catch.apply(err));
//       });
//     })
//   }
// });

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
