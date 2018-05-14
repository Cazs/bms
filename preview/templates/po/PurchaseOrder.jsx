// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { padStart } from 'lodash';
import currencies from '../../../libs/currencies.json';

// Styles
import styled from 'styled-components';

// Actions
import * as Actions from '../../../app/actions/settings';

import * as GlobalConstants from '../../../app/constants/globals';

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
    border-bottom: 2px solid #eeeeee;
    border-top: 3px solid #eeeeee;
    padding-top: 0.8em;
    padding-bottom: 0.8em;
    &:last-child {
      text-align: right;
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
  
  const blank_table_row =
  (
    <tr style={{ height: '2px', backgroundColor: '#eeeeee' }}>
      <td>{ }</td>
      <td>{ }</td>
      <td>{ }</td>
      <td>{ }</td>
      <td>{ }</td>
      <td>{ }</td>
      <td>{ }</td>
    </tr>
  );

  const font_family = 'inherit';
  const font_weight = 'light';
  const font_size= '11pt';
  const heading_font_size = '13pt';

  let sub_total = 0;
  pdf_data.resources.map(item => sub_total += item.cost * item.quantity);
  const vat = sub_total * pdf_data.vat / 100;
  const total = sub_total + vat;

  // console.log(pdf_data.profile);

  // Render Items
  return (
    <PurchaseOrderContent alignItems={setAlignItems(configs)} style={{width: '100%', backgroundColor: '#fff', marginTop: '-50px'}}>
      <div style={{marginTop: '0px', width: '100%'}}>
        <div className='row' style={{width: '100%'}}>
          <div className='col-lg-6'>
            <div style={{width: '300px', height: '160px', float: 'left', background: 'url(../static/images/logo.svg)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat'}} />
          </div>
          <div className='col-lg-6'>
            <h3 style={{float: 'right', textAlign: 'right', marginTop: '30px', fontSize: '16pt', fontFamily: font_family, fontWeight: 'bold'}}>Purchase Order</h3>
          </div>
        </div>

        <div className='row' style={{width: '100%'}}>
          <div className='col-lg-6' />
          <div className='col-lg-6'>
            <p style={{float: 'right', textAlign: 'right', marginTop: '30px', fontSize: '14pt', fontFamily: font_family, fontWeight: 'bold'}}>{pdf_data.profile.company}</p>
          </div>
        </div>

        <div className='row' style={{width: '100%'}}>
          <div className='pageItem col-lg-4 col-md-4 col-sm-4 col-xs-12'>
            <table  style={{marginTop: '-37px'}}>
              <tbody>
                <tr>
                  <td><p style={{float: 'left', fontWeight: 'bolder', textAlign: 'left', marginTop: '30px', fontSize: font_size, fontFamily: font_family}}>VAT No.: {pdf_data.profile.vat_number}</p></td>
                </tr>
                <tr>
                  <td>{pdf_data.profile.postal_address.split(',').map((line)=>(<p>{line}</p>))}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='pageItem col-lg-4 col-md-4 col-sm-4 col-xs-12'>
            {pdf_data.profile.address.split(',').map((line)=>(<p>{line}</p>))}
          </div>
          <div className='pageItem col-lg-4 col-md-4 col-sm-4 col-xs-12'>
            <table>
              <tbody>
                <tr>
                  <td>
                    <p style={{float: 'left', fontWeight: 'bolder', textAlign: 'left', fontSize: font_size, fontFamily: font_family}}>
                      Number: PO{pdf_data.object_number}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td><p style={{textAlign: 'left', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Date: {pdf_data.logged_date}</p></td>
                </tr>
                <tr>
                  <td><p style={{textAlign: 'left', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Reference:</p></td>
                </tr>
                <tr>
                  <td><p style={{textAlign: 'left', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Delivery Date:</p></td>
                </tr>
                <tr>
                  <td><p style={{textAlign: 'left', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Overall Discount %: 0.00%</p></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style={{height: '3px', backgroundColor: '#eeeeee'}} />

        <div className='row'>
          <div className='pageItem col-lg-4'>
            <p style={{textAlign: 'left', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{pdf_data.supplier.supplier_name}</p>
          </div>
        </div>

        <div className='row'>
          <div className='pageItem col-lg-4'>
            <p style={{textAlign: 'left', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>Supplier VAT No.: {pdf_data.supplier.vat_number}</p>
          </div>
        </div>

        <div className='row'>
          <div className='pageItem col-lg-4'>
            {
              pdf_data.supplier.physical_address.split(',').map((line)=>
              (
                <p style={{textAlign: 'left', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>
                  {line}
                </p>
              )
            )}
          </div>
        </div>

        {/* <div style={{height: '3px', backgroundColor: '#eeeeee'}} /> */}
        
        <Table
          accentColor='#A183E8'
          customAccentColor='lime'
        >
          <thead style={{fontFamily: font_family, fontSize: heading_font_size, fontWeight: 'bold'}}>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Excl.&nbsp;Price</th>
              <th>Disc&nbsp;%</th>
              <th>VAT&nbsp;%</th>
              <th>Exclusive&nbsp;Total</th>
              <th>Inclusive&nbsp;Total</th>
            </tr>
          </thead>
          <tbody>
            { pdf_data.resources.map((row, index) =>
            (
              <tr key={index}>
                {/* <td>{padStart(index + 1, 2, 0)}.</td> */}
                <td>{ row.item_description }</td>
                <td>{ row.quantity }</td>
                <td>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ row.cost }</td>
                <td>{ row.discount }</td>
                <td>{ pdf_data.vat }</td>
                <td><p style={{textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ Number(row.rate) * Number(row.quantity)}</p></td>
                <td><p style={{textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ Number(Number((Number(row.rate) * Number(row.quantity))) + Number((Number(row.rate) * Number(row.quantity)) * Number(pdf_data.vat)/100))}</p></td>
              </tr>
            ))}
          </tbody>
          <tfoot style={{marginTop: '40px', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>
            {blank_table_row}

            <tr>
              <td>Sub-Total: </td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td><p style={{textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ sub_total }</p></td>
            </tr>

            <tr>
              <td>VAT:</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td><p style={{textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ vat }</p></td>
            </tr>

            <tr>
              <td>Total:</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td>{ }</td>
              <td><p style={{textAlign: 'right', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}>{GlobalConstants.CURRENCY_SYMBOL}&nbsp;{ total }</p></td>
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
        {/* <div style={{width: '100%', backgroundColor: '#eeeeee', marginLeft: 'auto', marginRight: 'auto', marginTop: '20px', fontSize: '18pt'}}>
          <table style={{marginTop: '20px'}}>
            <tbody>
              <tr>
                <td style={{paddingRight: '200px', fontSize: font_size, fontFamily: font_family, fontWeight: font_weight}}><p>Acceptance: (Full Name)</p></td>
                <td><p>&nbsp;</p></td>
                <td><p style={{fontFamily: font_family, fontSize: font_size, fontWeight: font_weight}}>Signature:</p></td>
              </tr>
              <tr>
                <td><p> _________________________</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p>_________________________</p></td>
              </tr>

              <tr>
                <td><p style={{fontFamily: font_family, fontSize: font_size, fontWeight: font_weight}}>Order / Reference No.:</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p style={{fontFamily: font_family, fontSize: font_size, fontWeight: font_weight}}>Date:</p></td>
              </tr>

              <tr>
                <td><p>_________________________</p></td>
                <td><p>&nbsp;</p></td>
                <td colSpan='4'><p>_________________________</p></td>
              </tr>
            </tbody>
          </table>
        </div> */}
      </div>
    </PurchaseOrderContent>
  );
}

PurchaseOrder.propTypes =
{
  configs: PropTypes.object.isRequired,
  pdf_data: PropTypes.object.isRequired,
};

export default PurchaseOrder;
