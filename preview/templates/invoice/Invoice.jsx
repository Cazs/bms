// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { padStart } from 'lodash';
import currencies from '../../../libs/currencies.json';

// Helpers
import * as SessionManager from '../../../app/helpers/SessionManager';

// Styles
import styled from 'styled-components';

const InvoiceContent = styled.div`
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

const InvoiceTotal = styled.tr`
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
function Invoice({ pdf_data, configs, t })
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

  const font_family = 'Calibri';
  const font_weight = 'light';
  const font_size= '11pt';
  const heading_font_size = '13pt';
  
  let sub_total = 0;
  pdf_data.job.quote.resources.map(item => sub_total += item.unit_cost * item.quantity); // TODO: account for additional costs
  const vat = sub_total * pdf_data.vat / 100;
  const total = sub_total + vat;

  // Render Items
  return (
    <InvoiceContent alignItems={setAlignItems(configs)}>
      <div style={{marginTop: '-72px', marginLeft: '30px'}}>
        <table style={{width: '100%', border: '1px solid #000'}} border='1px solid #000'>
          <thead style={{fontSize: heading_font_size, fontFamily: font_family}}>
            <tr>
              <td colSpan='2'><p style={{fontSize: heading_font_size, textAlign: 'center', fontWeight: 'bold', width: '341px'}}>Client Details</p></td>
              <td>
                <p style={{fontSize: '13pt', textAlign: 'center', fontWeight: 'bold'}}>Invoice No.
                  <i style={{marginLeft: '15px', fontSize: '11pt'}}>
                    {SessionManager.session_usr.firstname}-
                    {SessionManager.session_usr.firstname.charAt(0) + SessionManager.session_usr.lastname.charAt(0)}-00
                    {pdf_data.object_number}
                  </i>
                </p>
              </td>
            </tr>
          </thead>
          <tbody style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>
            <tr>
              <td colSpan='2'><p>Contact Person: {pdf_data.job.quote.contact_person}</p></td>
              <td><p>Date: {pdf_data.logged_date}</p></td>
            </tr>

            <tr>
              <td colSpan='2'><p>Company: {pdf_data.job.quote.client_name}</p></td>
              <td>
                <p>Sale Consultant: {SessionManager.session_usr.name} </p>
              </td>
            </tr>

            <tr>
              <td colSpan='2'><p>Cell: {pdf_data.job.quote.contact.cell}</p></td>
              <td>
                <p>Consultant Cell: {SessionManager.session_usr.cell} </p>
                <p>Consultant eMail: {SessionManager.session_usr.email} </p>
              </td>
            </tr>

            <tr>
              <td colSpan='2'>
                <p>
                  <p style={{display: 'inline', fontSize: font_size}}>Tel: {pdf_data.job.quote.contact.tel ? pdf_data.job.quote.contact.tel : ''} {pdf_data.job.quote.client.tel ? ' / ' : ''} {pdf_data.job.quote.client.tel ? pdf_data.job.quote.client.tel : '' }</p>
                  <p style={{display: 'inline', marginLeft: '20px', fontSize: font_size}}>Fax: {pdf_data.job.quote.fax}</p>
                </p>
              </td>
              <td>
                <p>
                  <p style={{display: 'inline', fontSize: font_size}}>Rubeshen: 073 361 323</p>
                  <p style={{display: 'inline', marginLeft: '5px', fontSize: font_size}}>eMail: rubeshen@omegafs.co.za</p>
                </p>
                <p>
                  <p style={{display: 'inline', fontSize: font_size}}>Graham: 082 880 8659</p>
                  <p style={{display: 'inline', marginLeft: '5px', fontSize: font_size}}>eMail: graham@foag.co.za</p>
                </p>
              </td>
            </tr>

            <tr>
              <td colSpan='2'><p>eMail: {pdf_data.job.quote.contact_email}</p></td>
              <td>
                <p> {' '} </p>
              </td>
            </tr>

            <tr>
              <td colSpan='2'><p>Site: {pdf_data.job.quote.sitename}</p></td>
              <td>
                <p> {' '} </p>
              </td>
            </tr>

            <tr />
          </tbody>
        </table>

        <table style={{width: '100%', border: '1px solid #000'}} border='1px solid #000'>
          <thead style={{fontSize: heading_font_size, fontFamily: font_family}}>
            <tr>
              <th style={{borderLeft: '1px solid #000', borderRight: '1px solid #000', textAlign: 'center'}}>Item</th>
              <th style={{borderRight: '1px solid #000', textAlign: 'center', width: '290px'}}>Description</th>
              <th style={{borderRight: '1px solid #000', textAlign: 'center'}}>Unit</th>
              <th style={{borderRight: '1px solid #000', textAlign: 'center'}}>Qty</th>
              <th style={{borderRight: '1px solid #000', textAlign: 'center'}}>Rate</th>
              <th style={{borderRight: '1px solid #000', textAlign: 'center'}}>Total&nbsp;Cost</th>
            </tr>
          </thead>
          <tbody style={{fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>
            
            { blank_table_row }

            {/* Print Request */}
            <tr>
              <td>{ }</td>
              <td>{ pdf_data.job.quote.request }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
            </tr>

            { blank_table_row }

            {/* Print Quote Items */}
            { pdf_data.job.quote.resources.map((row, index) => (
              <tr key={index}>
                <td>{padStart(index + 1, 2, 0)}</td>
                <td>{ row.item_description }</td>
                <td>{ row.unit }</td>
                <td>{ row.quantity }</td>
                <td>R&nbsp;{ row.unit_cost.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") }</td>
                <td>R&nbsp;{ (row.unit_cost * row.quantity).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") }</td>
              </tr> ))
            }

            { blank_table_row }

            {/* Print totals */}
            <tr style={{height: '30px'}}>
              <td>{ }</td>
              <td>Sub-total excluding VAT:</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>R{ sub_total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") }</td>
            </tr>

            <tr style={{height: '30px'}}>
              <td>{ }</td>
              <td>VAT:</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>R { vat.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") }</td>
            </tr>

            <tr style={{height: '30px'}}>
              <td>{ }</td>
              <td>Total including VAT:</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>R{ total.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") }</td>
            </tr>
          </tbody>
        </table>
        
        <div style={{width: '100%', backgroundColor: '#fff', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', fontSize: font_size, fontFamily: font_family}}>
          <p style={{textAlign: 'center', fontSize: heading_font_size}}>Terms and Conditions of Sale</p>
          <p>*Validity: Quote valid subject to rate of exchange (30days)</p>
          <p>*Payment Terms: COD / 30 Days on approved accounts.</p>
          <p>*Delivery: 1 - 6 Weeks, subject to stock availability.</p>
          <p>*All pricing quoted, is subject to the exchange rate variations</p>
          <p>*All goods / equipment remain the property Omega Fire and Security until paid for completely.</p>
          <p>*Omega Fire and Security reserves the right to retake possession of all equipment not paid for completely within the payment term set out above E &amp; OE</p>

          <table style={{marginTop: '20px', width: '100%', backgroundColor: '#fff'}}>
            <tbody>
              <tr>
                <td style={{paddingRight: '0px'}}><p>Acceptance: (Full Name)</p></td>
                <td><p>&nbsp;</p></td>
                <td><p style={{float:'right', textAlign: 'right'}}>Signature:</p></td>
              </tr>
              <tr>
                <td><p> _________________________</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p p style={{float:'right', textAlign: 'right'}}>_________________________</p></td>
              </tr>

              <tr>
                <td><p>Order / Reference No.:</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p p style={{float:'right', textAlign: 'right'}}>Date:</p></td>
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
    </InvoiceContent>
  );
}

Invoice.propTypes =
{
  configs: PropTypes.object.isRequired,
  pdf_data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default Invoice;
