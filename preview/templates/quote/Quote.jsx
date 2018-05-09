// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { padStart } from 'lodash';
import currencies from '../../../libs/currencies.json';

// Helpers
// import sessionManager from '../../../app/helpers/SessionManager';
import Log, { formatDate } from '../../../app/helpers/Logger';
import * as GlobalConstants from '../../../app/constants/globals';
import { getQuoteItemTotal } from '../../../helpers/quote';

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
    border-bottom: 1px solid #efefd1;
    border-top: 1px solid #efefd1;
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
      border: 1px solid #5C5C5C !important;
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
    border-bottom: 1px solid #5C5C5C;
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
  const blank_table_row = (
    <tr style={{height: '30px'}}>
      <td>{ }</td>
      <td>{ }</td>
      <td>{ }</td>
      <td>{ }</td>
      <td>{ }</td>
      <td>{ }</td>
    </tr>);

  const font_family = 'inherit';
  const font_weight = 'light';
  const font_size= '11pt';
  const heading_font_size = '13pt';

  let sub_total = 0;
  pdf_data.resources.map((item) => sub_total += getQuoteItemTotal(item));

  sub_total = sub_total.toFixed(2);

  const vat = Number(sub_total * pdf_data.vat / 100).toFixed(2);
  const total = Number(Number(sub_total) + Number(vat)).toFixed(2);

  // const sessionManager  = require('../../../app/helpers/SessionManager').default;

  // Render Items
  return (
    <QuoteContent alignItems={setAlignItems(configs)}>
      <div style={{marginTop: '-72px'}}>
        <table style={{width: '100%', border: '1px solid #5C5C5C'}} border='1px solid #5C5C5C'>
          <thead style={{fontSize: heading_font_size, fontFamily: font_family}}>
            <tr>
              <td colSpan='2'>
                <p style={{fontSize: heading_font_size, textAlign: 'center', fontWeight: 'bold', width: '341px'}}>Client Details</p>
              </td>
              <td>
                <p style={{fontSize: '12pt', textAlign: 'center', fontWeight: 'bold'}}>Quote No.
                  <i style={{marginLeft: '15px', fontSize: '11pt'}}>
                    {pdf_data.creator_employee.firstname}-
                    {pdf_data.creator_employee.firstname.charAt(0)}
                    {pdf_data.creator_employee.lastname.charAt(0)}-00
                    {pdf_data.object_number}
                    &nbsp;REV&nbsp;
                    {pdf_data.revision}
                  </i>
                </p>
              </td>
            </tr>
          </thead>
          <tbody style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>
            <tr>
              <td colSpan='2'>
                <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Contact Person: {pdf_data.contact_person}</p>
              </td>
              <td>
                <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Date: {pdf_data.logged_date}</p>
              </td>
            </tr>

            <tr>
              <td colSpan='2'>
                <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Company: {pdf_data.client.client_name}</p>
              </td>
              <td>
                <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Sale Consultant: {pdf_data.creator_employee.name} </p>
              </td>
            </tr>

            <tr>
              <td colSpan='2'>
                <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Cell: {pdf_data.contact.cell}</p>
              </td>
              <td>
                <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Consultant Cell: {pdf_data.creator_employee.cell} </p>
                <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Consultant eMail: {pdf_data.creator_employee.email} </p>
              </td>
            </tr>

            <tr>
              <td colSpan='2'>
                <p>
                  <p style={{display: 'inline', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Tel:&nbsp;{pdf_data.contact.tel ? pdf_data.contact.tel : ''} {pdf_data.client.tel ? ' / ' : ''} {pdf_data.client.tel ? pdf_data.client.tel : '' }</p>
                  <p style={{display: 'inline', marginLeft: '10px', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Fax:&nbsp;{pdf_data.client.fax}</p>
                </p>
              </td>
              <td>
                <p>
                  <p style={{display: 'inline', fontSize: '8pt', fontFamily: font_family, fontWeight: font_weight}}>Rubeshen:&nbsp;073&nbsp;361&nbsp;323</p>&nbsp;
                  <p style={{display: 'inline', marginLeft: '5px', fontSize: '8pt', fontFamily: font_family, fontWeight: font_weight}}>eMail:&nbsp;rubeshen@omegafs.co.za</p>
                </p>
                <p>
                  <p style={{display: 'inline', fontSize: '8pt', fontFamily: font_family, fontWeight: font_weight}}>Graham:&nbsp;082&nbsp;880&nbsp;8659</p>&nbsp;
                  <p style={{display: 'inline', marginLeft: '5px', fontSize: '8pt', fontFamily: font_family, fontWeight: font_weight}}>eMail:&nbsp;graham@foag.co.za</p>
                </p>
              </td>
            </tr>

            <tr>
              <td colSpan='2'>
                <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>eMail: {pdf_data.contact.email}</p>
              </td>
              <td>
                <p> {' '} </p>
              </td>
            </tr>

            <tr>
              <td colSpan='2'><p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Site:&nbsp;{pdf_data.sitename}</p></td>
              <td>
                <p> {' '} </p>
              </td>
            </tr>

          </tbody>
        </table>

        <table style={{width: '100%', border: '1px solid #5C5C5C'}} border='1px solid #5C5C5C'>
          <thead style={{fontSize: heading_font_size, fontFamily: font_family, fontWeight: 'bold'}}>
            <tr>
              <th style={{borderLeft: '1px solid #5C5C5C', borderRight: '1px solid #5C5C5C', textAlign: 'center'}}>Item</th>
              <th style={{borderRight: '1px solid #5C5C5C', textAlign: 'center', width: '320px'}}>Description</th>
              <th style={{borderRight: '1px solid #5C5C5C', textAlign: 'center'}}>Unit</th>
              <th style={{borderRight: '1px solid #5C5C5C', textAlign: 'center'}}>Qty</th>
              <th style={{borderRight: '1px solid #5C5C5C', textAlign: 'center'}}>Rate</th>
              <th style={{borderRight: '1px solid #5C5C5C', textAlign: 'center'}}>Total&nbsp;Cost</th>
            </tr>
          </thead>
          <tbody style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>
            
            { blank_table_row }

            {/* Print Request */}
            <tr>
              <td>{ }</td>
              <td style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{ pdf_data.request }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
            </tr>

            { blank_table_row }

            {/* Print Quote Items */}
            { pdf_data.resources.map((row, index) =>
              {
                const item_total = Number(getQuoteItemTotal(row)).toFixed(2);
                const item_rate = Number(Number(item_total) / Number(row.quantity)).toFixed(2);
                return (
                  <tr key={index} style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>
                    <td>{padStart(index + 1, 2, 0)}</td>
                    <td>{ row.item_description }</td>
                    <td>{ row.unit }</td>
                    <td>{ row.quantity }</td>
                    <td><p style={{float: 'right', textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ item_rate.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ") }</p></td>
                    <td><p style={{float: 'right', textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ (item_total).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ") }</p></td>
                  </tr> )
              })
            }

            { blank_table_row }

            {/* Print totals */}
            <tr style={{height: '30px'}}>
              <td>{ }</td>
              <td><p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Sub-total excluding VAT:</p></td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td><p style={{float: 'right', textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ sub_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ") }</p></td>
            </tr>

            <tr style={{height: '30px'}}>
              <td>{ }</td>
              <td><p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>VAT:</p></td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td><p style={{float: 'right', textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ vat.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ") }</p></td>
            </tr>

            <tr style={{height: '30px'}}>
              <td>{ }</td>
              <td><p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Total including VAT:</p></td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td><p style={{float: 'right', textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ") }</p></td>
            </tr>
          </tbody>
        </table>

        {/* <p style={{borderBottom: '1px solid black', borderLeft: '1px solid black', borderRight: '1px solid black'}}>Sitename: {pdf_data.sitename}</p>
        <p style={{borderBottom: '1px solid black', borderLeft: '1px solid black', borderRight: '1px solid black'}}>Request: {pdf_data.request}</p> */}
        
        <div style={{width: '100%', backgroundColor: '#fff', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', fontSize: font_size, fontFamily: font_family}}>
          <p style={{textAlign: 'center', fontSize: heading_font_size, fontWeight: 'bold'}}>Terms and Conditions of Sale</p>
          <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>*Validity: Quote valid subject to rate of exchange (30days)</p>
          <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>*Payment Terms: COD / 30 Days on approved accounts.</p>
          <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>*Delivery: 1 - 6 Weeks, subject to stock availability.</p>
          <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>*All pricing quoted, is subject to the exchange rate variations</p>
          <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>*All goods / equipment remain the property Omega Fire and Security until paid for completely.</p>
          <p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>*Omega Fire and Security reserves the right to retake possession of all equipment not paid for completely within the payment term set out above E &amp; OE</p>

          <table style={{marginTop: '20px', width: '100%', backgroundColor: '#fff'}}>
            <tbody>
              <tr>
                <td style={{paddingRight: '0px'}}><p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Acceptance: (Full Name)</p></td>
                <td><p>&nbsp;</p></td>
                <td><p style={{float:'right', textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Signature:</p></td>
              </tr>
              <tr>
                <td><p> _________________________</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p p style={{float:'right', textAlign: 'right'}}>_________________________</p></td>
              </tr>

              <tr>
                <td><p style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Order / Reference No.:</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p p style={{float:'right', textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Date:</p></td>
              </tr>

              <tr>
                <td><p>_________________________</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p p style={{float:'right', textAlign: 'right'}}>_________________________</p></td>
              </tr>
            </tbody>
          </table>
        </div>
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
