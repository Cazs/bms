// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { padStart } from 'lodash';
import currencies from '../../../libs/currencies.json';

// Helpers
import * as SessionManager from '../../../app/helpers/SessionManager';

// Styles
import styled from 'styled-components';

const PurchaseOrderContent = styled.div`
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

const PurchaseOrderTotal = styled.tr`
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
function PurchaseOrder({ pdf_data, configs, t })
{
  // Set language
  // const { language, accentColor, customAccentColor  } = configs;
  // Set placement
  // const currencyBefore = placement === 'before';
  // Set Currency Sign
  // const currency = configs.useSymbol ? currencies[code].symbol : code;
  
  let sub_total = 0;
  pdf_data.resources.map(item => sub_total += item.unit_cost * item.quantity); // TODO: account for additional costs
  const vat = sub_total * pdf_data.vat / 100;
  const total = sub_total + vat;

  // Render Items
  return (
    <PurchaseOrderContent alignItems={setAlignItems(configs)}>
      <div style={{marginTop: '-72px'}}>
        <table style={{width: '100%', fontSize: '16pt'}} border='1px solid red'>
          <thead>
            <tr>
              <td><strong>Supplier Details</strong></td>
              <td>
                <strong>PurchaseOrder No.</strong>
                <i style={{marginLeft: '15px'}}>
                  {SessionManager.session_usr.firstname}-
                  {SessionManager.session_usr.firstname.charAt(0) + SessionManager.session_usr.lastname.charAt(0)}-00
                  {pdf_data.object_number}
                  {/* &nbsp;REV&nbsp;{pdf_data.revision} */}
                </i>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><p>Contact Person: {pdf_data.contact_person}</p></td>
              <td><p>Date: {pdf_data.date_logged}</p></td>
            </tr>

            <tr>
              <td><p>Company: {pdf_data.supplier.supplier_name}</p></td>
              <td>
                <p>Sale Consultant: {SessionManager.session_usr.name} </p>
              </td>
            </tr>

            <tr>
              <td><p>Cell: {pdf_data.contact.cell}</p></td>
              <td>
                <p>Consultant Cell: {SessionManager.session_usr.cell} </p>
                <p>Consultant eMail: {SessionManager.session_usr.email} </p>
              </td>
            </tr>

            <tr>
              <td><p>Tel: {pdf_data.contact.tel ? pdf_data.contact.tel : ''} {pdf_data.supplier.tel ? ' / ' : ''} {pdf_data.supplier.tel ? pdf_data.supplier.tel : '' }</p></td>
              <td><p>Fax: {pdf_data.supplier.fax}</p></td>
            </tr>
          </tbody>
        </table>
        
        <Table
          accentColor='#A183E8'
          customAccentColor='lime'
        >
          <thead>
            <tr>
              <th style={{borderLeft: '1px solid #A183E8', borderRight: '1px solid #A183E8'}}>Item&nbsp;Number</th>
              <th style={{borderRight: '1px solid #A183E8'}}>Item&nbsp;Description</th>
              <th style={{borderRight: '1px solid #A183E8'}}>Unit</th>
              <th style={{borderRight: '1px solid #A183E8'}}>Qty</th>
              <th style={{borderRight: '1px solid #A183E8'}}>Rate</th>
              <th style={{borderRight: '1px solid #A183E8'}}>Total&nbsp;Cost</th>
            </tr>
          </thead>
          <tbody>
            { pdf_data.resources.map((row, index) => (
              <tr key={index}>
                <td>{padStart(index + 1, 2, 0)}.</td>
                <td>{ row.item_description }</td>
                <td>{ row.unit }</td>
                <td>{ row.quantity }</td>
                <td>R&nbsp;{ row.unit_cost }</td>
                <td>R&nbsp;{ row.unit_cost * row.quantity }</td>
              </tr> ))
            }
          </tbody>
          <tfoot style={{marginTop: '40px'}}>
            <tr>
              <td>Sub-Total: </td>
              <td colSpan="5">R&nbsp;{ sub_total }</td>
            </tr>

            <tr>
              <td>VAT: </td>
              <td colSpan="5">R&nbsp;{ vat }</td>
            </tr>

            <tr>
              <td>Total: </td>
              <td colSpan="5">R&nbsp;{ total }</td>
            </tr>

            {/* <tr className="quote__subtotal">
              <td colSpan="2" />
              <td className="label" colSpan="2">
                {t('preview:common:subtotal')}
              </td>
              <td>
                R { 10000 - 10000 * 0.15 }
              </td>
            </tr>

            <PurchaseOrderTotal
              accentColor='red'
              customAccentColor='lime'
            >
              <td colSpan="2" />
              <td className="label">{t('preview:common:total')}</td>
              <td colSpan="2">
                R 10, 000
              </td>
            </PurchaseOrderTotal> */}
          </tfoot>
        </Table>
        <div style={{width: '100%', backgroundColor: '#eeeeee', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', fontSize: '18pt'}}>
          <table style={{marginTop: '20px'}}>
            <tbody>
              <tr>
                <td style={{paddingRight: '200px'}}><p>Acceptance: (Full Name)</p></td>
                <td><p>&nbsp;</p></td>
                <td><p>Signature:</p></td>
              </tr>
              <tr>
                <td><p> _________________________</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p>_________________________</p></td>
              </tr>

              <tr>
                <td><p>Order / Reference No.:</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p>Date:</p></td>
              </tr>

              <tr>
                <td><p>_________________________</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p>_________________________</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PurchaseOrderContent>
  );
}

PurchaseOrder.propTypes =
{
  configs: PropTypes.object.isRequired,
  pdf_data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default PurchaseOrder;
