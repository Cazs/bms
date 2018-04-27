// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { padStart } from 'lodash';
import currencies from '../../../libs/currencies.json';

// Helpers
import * as SessionManager from '../../../app/helpers/SessionManager';

// Styles
import styled from 'styled-components';

const QuoteContent = styled.div`
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

const QuoteTotal = styled.tr`
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

// Component
function Quote({ pdf_data, configs, t })
{
  // Set language
  // const { language, accentColor, customAccentColor  } = configs;
  // Set placement
  // const currencyBefore = placement === 'before';
  // Set Currency Sign
  // const currency = configs.useSymbol ? currencies[code].symbol : code;
  
  let sub_total = 0;
  pdf_data.quote.resources.map(item => sub_total += item.unit_cost * item.quantity); // TODO: account for additional costs
  const vat = sub_total * pdf_data.vat / 100;
  const total = sub_total + vat;

  // Render Items
  return (
    <QuoteContent alignItems={setAlignItems(configs)}>
      <div style={{marginTop: '-60px'}}>
        <h4 style={{textAlign: 'center'}}>JOB&nbsp;CARD</h4>
        <table style={{fontSize: '16pt'}} border='1'>
          <tbody>
            <tr>
              <td style={{paddingRight: '100px'}}><p>ISO:&nbsp;9001:&nbsp;2008</p></td>
              <td style={{paddingRight: '80px'}}><p>Effective&nbsp;Date:&nbsp;2014.04.10</p></td>
              <td style={{paddingRight: '135px'}}><p>Authorised&nbsp;By:</p></td>
            </tr>
          </tbody>
        </table>
        <table style={{width: '100%', fontSize: '16pt'}} border='1'>
          <tbody>
            <tr>
              <td>
                <p>Job&nbsp;No.: #{pdf_data.object_number}</p>
              </td>
              <td><p>Date&nbsp;Logged: { new Date(pdf_data.date_logged * 1000).toString() }</p></td>
            </tr>
            <tr>
              <td>
                <p>Customer: {pdf_data.client_name}</p>
              </td>
              <td><p>Address: {pdf_data.quote.client.physical_address}</p></td>
            </tr>
            <tr>
              <td>
                <p>Site: {pdf_data.quote.sitename}</p>
              </td>
              <td><p>Contact: {pdf_data.contact_person}</p></td>
            </tr>
            <tr>
              <td>
                <p>Technician: </p>
              </td>
              <td>
                <p>Start&nbsp;Time: </p>
                <p>End&nbsp;Time: </p>
              </td>
            </tr>
          </tbody>
        </table>

        <p style={{fontSize: '12pt', borderBottom: '1px solid black', borderLeft: '1px solid black', borderRight: '1px solid black'}}>Request: {pdf_data.request}</p>

        <table style={{width: '100%', fontSize: '16pt'}} border='1'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time&nbsp;In</th>
              <th>Time&nbsp;Out</th>
              <th>Description&nbsp;Of Work&nbsp;Done</th>
              <th>Materials&nbsp;Used</th>
              <th>Model/Serial</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
            </tr>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
            </tr>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
            </tr>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
            </tr>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
            </tr>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
            </tr>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
            </tr>
          </tbody>
        </table>

        <table style={{marginTop: '40px',width: '100%', fontSize: '16pt'}} border='1'>
          <thead>
            <tr style={{backgroundColor: '#eeeeee'}}>
              <th>Labour&nbsp;Hours</th>
              <th>Travel&nbsp;Hours</th>
              <th>Klms.</th>
              <th>Other&nbsp;Staff</th>
              <th>PO</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td style={{backgroundColor: '#eeeeee'}}><p>Quote</p></td>
            </tr>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td style={{backgroundColor: '#eeeeee'}}><p>Client&nbsp;PO</p></td>
            </tr>
            <tr>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td><p>&nbsp;</p></td>
              <td style={{backgroundColor: '#eeeeee'}}><p>Invoice</p></td>
            </tr>
          </tbody>
        </table>
        
        <div style={{width: '100%', backgroundColor: '#eeeeee', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', fontSize: '18pt'}}>
          <p>CUSTOMER NOTE: ________________________________________________________________________________________</p>
          <p>The authorised signatory agrees that the detailed tasks listed above have been performed and completed to the client&apos;s
            satisfaction and acknowledges that all equipment installed remains the property of Omega Fire &amp; Security until
            final payment has been received.
          </p>

          <table style={{marginTop: '20px'}}>
            <tbody>
              <tr>
                <td><p>Customer Name</p></td>
                <td><p>Customer Signature:</p></td>
                <td><p>Designation:</p></td>
              </tr>
              <tr>
                <td><p> _________________________</p></td>
                <td><p> _________________________</p></td>
                <td><p>_________________________</p></td>
              </tr>

              <tr>
                <td><p>Technician Signature:</p></td>
                <td><p>&nbsp;</p></td>
                <td><p>Date:</p></td>
              </tr>

              <tr>
                <td><p>_________________________</p></td>
                <td><p>&nbsp;</p></td>
                <td><p>_________________________</p></td>
              </tr>
            </tbody>
          </table>
        </div>
        <table style={{width: '100%', border:' 1px solid #000', marginTop: '5px', fontSize: '10pt'}}>
          <tbody>
            <tr>
              <td>Omega&nbsp;Fire&nbsp;&amp;&nbsp;Security</td>
              <td>Form&nbsp;20&nbsp;:Job&nbsp;Card</td>
              <td>Revision&nbsp;1&nbsp;:10&nbsp;April&nbsp;2014</td>
            </tr>
          </tbody>
        </table>
      </div>
    </QuoteContent>
  );
}

Quote.propTypes =
{
  configs: PropTypes.object.isRequired,
  pdf_data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default Quote;
