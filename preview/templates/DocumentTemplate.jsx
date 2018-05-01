// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { padStart } from 'lodash';
import currencies from '../../libs/currencies.json';

// Helpers
import * as SessionManager from '../../app/helpers/SessionManager';

// Styles
import styled from 'styled-components';

const SafetyDocumentContent = styled.div`
  flex: 1;
  display: flex;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
  ${props =>
    props.alignItems &&
    `
    align-items: ${props.alignItems};
  `};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  th {
    border-bottom: 2px solid #efefd1;
    border-top: 2px solid #efefd1;
    padding-bottom: 0.8em;
    &:last-child {
      text-align: right;
    }
  }

  thead {margin-top: 15px;}
  ${props =>
    props.customAccentColor &&
    `
    th
    {
      padding: 5px;
      // border-bottom: 1px solid ${props.accentColor};
      // border-top: 1px solid ${props.accentColor};
      border: 1px solid #000 !important;
      padding-bottom: 10px;
    }
  `};
  tr > td:last-child {
    text-align: right;
  }
  td {
    color: #2c323a;
    font-weight: 300;
    line-height: 2.75;
    font-size: 0.7em;
    border-bottom: 2px solid #ecf1f1;
    &:first-child {
      color: #c4c8cc;
    }
  }
  tfoot {
    td {
      font-weight: 400;
      &:first-child {
        border: none;
      }
    }
  }
`;

const SafetyDocumentTotal = styled.tr`
  font-size: 1.5em;
  td {
    border-bottom: none;
    line-height: 2;
    border-top: 4px solid #efefd1;
    color: #6bbb69;
    &:first-child {
      border: none;
    }
  }

  ${props =>
    props.customAccentColor &&
    `
    td {
      border-top: 1px solid ${props.accentColor};
    }
  `};
`;

const MessageStyle = styled.div`
  padding: 20px;
  font-weight: 200;
  color: #4f555c;
  background: white;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  ${props => props.info && `border-left: 5px solid #469FE5; border-right: 5px solid #469FE5;`} ${props =>
      props.success && `border-left: 5px solid #6BBB69; border-right: 5px solid #6BBB69;`} ${props =>
      props.danger && `border-left: 5px solid #EC476E; border-right: 5px solid #EC476E;`} ${props =>
      props.warning && `border-left: 5px solid #F9D548; border-right: 5px solid #F9D548;`};
`;

// Component
const Message = props => <MessageStyle {...props}>{props.text}</MessageStyle>;


function setAlignItems(configs)
{
  let pos;
  switch (configs.alignItems)
  {
    case 'top':
    {
      pos = 'flex-start';
      break;
    }
    case 'bottom':
    {
      pos = 'flex-end';
      break;
    }
    default:
    {
      pos = 'center';
      break;
    }
  }
  return pos;
}

const renderPDF = () =>
{
  // atob() is used to convert base64 encoded PDF to binary-like data.
  // (See also https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/
  // Base64_encoding_and_decoding.)
  const pdfData = atob(
    'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
    'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
    'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
    'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
    'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
    'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
    'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
    'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
    'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
    'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
    'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
    'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
    'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');

  // Loaded via <script> tag, create shortcut to access PDF.js exports.
  // const pdfjsLib = window['pdfjs-dist/build/pdf'];

  // The workerSrc property shall be specified.
  pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

  // Using DocumentInitParameters object to load binary data.
  const loadingTask = pdfjsLib.getDocument({data: pdfData});
  loadingTask.promise.then((pdf) =>
  {
    console.log('PDF loaded');
    
    // Fetch the first page
    const pageNumber = 1;
    pdf.getPage(pageNumber).then((page) => {
      console.log('Page loaded');
      
      const scale = 1.5;
      const viewport = page.getViewport(scale);

      // Prepare canvas using PDF page dimensions
      const canvas = document.getElementById('the-canvas');
      const context = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext =
      {
        canvasContext: context,
        viewport
      };
      const renderTask = page.render(renderContext);
      renderTask.then(() =>
      {
        console.log('Page rendered');
      });
    });
  }, (reason) =>
  {
    // PDF loading error
    console.error(reason);
  });
}

// Component
function SafetyDocument({ pdf_data, configs, t })
{
  // let { pdf } = this.context
  // let numPages = pdf ? pdf.pdfInfo.numPages : 0
  // let fingerprint = pdf ? pdf.pdfInfo.fingerprint : 'none'
  // let pages = Array.apply(null, { length: numPages })
  //   .map((v, i) => (<Page index={i + 1} key={`${fingerprint}-${i}`}/>))
      
  // Render document
  return (
    <SafetyDocumentContent alignItems={setAlignItems(configs)}>
      <div style={{marginTop: '0px'}}>
        <iframe title={pdf_data.filename} src={pdf_data.file} type={pdf_data.content_type} />
      </div>
    </SafetyDocumentContent>
  );
}

SafetyDocument.propTypes =
{
  configs: PropTypes.object.isRequired,
  pdf_data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default SafetyDocument;
