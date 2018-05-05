// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const openDialog = require('../../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;

import { translate } from 'react-i18next';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

// Actions
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';
// Helpers
import * as SessionManager from '../../helpers/SessionManager';
import * as PurchaseOrderActions from '../../actions/operations/purchase_orders';
import Log, { formatDate } from '../../helpers/Logger';

// Animation
import { Motion, spring } from 'react-motion';
import Transition from 'react-motion-ui-pack'

// Global constants
import * as GlobalConstants from  '../../constants/globals';

// Selectors
import { getEmployees } from '../../reducers/HR/EmployeesReducer';
import { getMaterials } from '../../reducers/Operations/MaterialsReducer';
import { getPurchaseOrders } from '../../reducers/Operations/PurchaseOrdersReducer';
import { getSuppliers } from '../../reducers/Operations/SuppliersReducer';

// Components
import ComboBox from '../../components/shared/ComboBox';

import Message from '../../components/shared/Message';
import CustomButton, { ButtonsGroup } from '../../components/shared/Button';
import { Field, Part, Row } from '../../components/shared/Part';
import Logo from '../../components/settings/_partials/profile/Logo';

import Modal from 'react-modal';

// Styles
import styled from 'styled-components';

import _withFadeInAnimation from '../../components/shared/hoc/_withFadeInAnimation';
import {
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../../components/shared/Layout';

const modalStyle = {
  content : {
    top                   : '15%',
    left                  : '7%',
    right                 : 'auto',
    bottom                : 'auto',
    // marginRight           : '-50%',
    border                : '2px solid black',
    minWidth              : window.outerWidth-160, // '950px'
    // transform             : 'translate(-50%, -50%)'
  }
};

export class PurchaseOrders extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.editPurchaseOrder = this.editPurchaseOrder.bind(this);
    this.deletePurchaseOrder = this.deletePurchaseOrder.bind(this);
    this.duplicatePurchaseOrder = this.duplicatePurchaseOrder.bind(this);
    this.setPurchaseOrderStatus = this.setPurchaseOrderStatus.bind(this);
    this.expandComponent = this.expandComponent.bind(this);
    this.getCaret = this.getCaret.bind(this);
    
    // this.creator_ref = React.createRef();
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.col_toggles_container = null;
    this.col_width = 235;
    this.state =  {
                    filter: null,
                    is_new_purchase_order_modal_open: false,
                    is_purchase_order_items_modal_open: false,
                    selected_purchaseOrder: null,
                    active_row: null,
                    column_toggles_top: -200,
                    info: {x: 200, y: 200, display: 'none'},
                    // Table Column Toggles
                    col_id_visible: false,
                    col_object_number_visible: true,
                    col_supplier_id_visible: true,
                    col_contact_person_id_visible: false,
                    col_sitename_visible: false,
                    col_request_visible: true,
                    col_vat_visible: false,
                    col_revision_visible: false,
                    col_status_visible: true,
                    col_creator_visible: false,
                    col_date_logged_visible: false,
                    // PurchaseOrder to be created
                    new_purchase_order:
                    {
                      supplier_id: null,
                      supplier: null,
                      contact_id: null,
                      contact: null,
                      request: null,
                      sitename: null,
                      notes: null,
                      vat: GlobalConstants.VAT,
                      status: 0,
                      resources: []
                    },
                    // PurchaseOrder Item to be added
                    new_po_item:
                    {
                      purchase_order_id: null,
                      item_id: null,
                      unit_cost: 0,
                      quantity: 1,
                      discount: 0,
                      additional_costs: ''
                    }
    };
  }

  // Load PurchaseOrders & add event listeners
  componentDidMount()
  {
    this.props.dispatch(PurchaseOrderActions.getPurchaseOrders());

    // mapStateToProps(this.state);
    // Add Event Listener
    ipc.on('confirmed-delete-job', (event, index, jobId) =>
    {
      if (index === 0)
      {
        this.confirmedDeleteJob(jobId);
      }
    });

    ipc.on('confirmed-delete-purchaseOrder', (event, index, purchaseOrderId) =>
    {
      if (index === 0)
      {
        this.confirmedDeletePurchaseOrder(purchaseOrderId);
      }
    });
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount()
  {
    ipc.removeAllListeners('confirmed-delete-purchaseOrder');
  }

  showPOPreview(po)
  {
    // Preview Window
    ipc.send('preview-po', po);
  }

  // Open Confirm Dialog
  deletePurchaseOrder(purchaseOrderId)
  {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deletePurchaseOrder:title'),
        message: t('dialog:deletePurchaseOrder:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-purchaseOrder',
      purchaseOrderId
    );
  }

  // Confirm Delete an purchaseOrder
  confirmedDeletePurchaseOrder(purchaseOrderId)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.deletePurchaseOrder(purchaseOrderId));
  }

  // set the purchaseOrder status
  setPurchaseOrderStatus(purchaseOrderId, status)
  {
    alert('set status to: ' + status);
    const { dispatch } = this.props;
    // dispatch(Actions.setPurchaseOrderStatus(purchaseOrderId, status));
  }

  editPurchaseOrder(purchaseOrder)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.editPurchaseOrder(purchaseOrder));
  }

  duplicatePurchaseOrder(purchaseOrder)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.duplicatePurchaseOrder(purchaseOrder));
  }

  setFilter(event)
  {
    const currentFilter = this.state.filter;
    const newFilter = event.target.dataset.filter;
    this.setState({ filter: currentFilter === newFilter ? null : newFilter });
  }

  getCaret(direction)
  {
    if (direction === 'asc')
    {
      return (
        <img
          src="../static/open-iconic-master/svg/caret-top.svg"
          alt='up'
          onMouseEnter={(evt)=>this.setState({info: Object.assign(this.state.info, {display: 'block', x: evt.clientX, y: evt.clientY})})}
          onMouseLeave={(evt)=>this.setState({info: Object.assign(this.state.info, {display: 'none'})})}
        />
      );
    }
    if (direction === 'desc')
    {
      return (
        <img
          src="../static/open-iconic-master/svg/caret-bottom.svg"
          alt='down'
          onMouseEnter={(evt)=>this.setState({info: Object.assign(this.state.info, {display: 'block', x: evt.clientX, y: evt.clientY})})}
          onMouseLeave={(evt)=>this.setState({info: Object.assign(this.state.info, {display: 'none'})})}
        />
      );
    }
    
    return (
      <span
        style={{marginLeft: '5px'}}
      >
        <img
          src="../static/open-iconic-master/svg/info.svg"
          alt='info'
          style={{
            width: '13px',
            height: '13px',
            marginLeft: '0px'
            }}
          onMouseEnter={(evt)=>this.setState({info: Object.assign(this.state.info, {display: 'block', x: evt.clientX, y: evt.clientY})})}
          onMouseLeave={(evt)=>this.setState({info: Object.assign(this.state.info, {display: 'none'})})}
        />
      </span>
    );
  }

  onAfterSaveCell(row, cellName, cellValue)
  {
    // alert(`After cell save ${cellName} with value ${cellValue}`);
  
    // let rowStr = '';
    /* for (const prop in row) {
      rowStr += prop + ': ' + row[prop] + '\n';
    } */
  
    // alert('Thw whole row :\n' + rowStr);
  }
  
  onBeforeSaveCell(row, cellName, cellValue)
  {
    // alert(`Before cell save ${cellName} with value ${cellValue}`);
    // You can do any validation on here for editing value,
    // return false for reject the editing
    return true;
  }

  isExpandableRow(row)
  {
    // (row.object_number < 50) ? return true : return false;
    return true;
  }

  expandComponent(row)
  {
    const cellEditProp =
    {
      mode: 'click',
        // if product id less than 3, will cause the whole row noneditable
        // this function should return an array of row keys
        // pos.filter(q => q.id < 3).map(p => p.id)
      nonEditableRows: () => ['_id', 'object_number'],
      blurToSave: true
      // beforeSaveCell: {},// this.onBeforeSaveCell, // a hook for before saving cell
      // afterSaveCell: {}// this.onAfterSaveCell  // a hook for after saving cell
    };

    const options =
    {
      defaultSortName: 'item_number',  // default sort column name
      defaultSortOrder: 'asc'
    };

    const po_options = (
      <div>
        <CustomButton primary onClick={() => this.showPOPreview(row)}>PDF Preview</CustomButton>
      </div>
    );

    const new_po_item_form = (
      <div>
        {/* form for adding a new PurchaseOrderItem */}
        <div style={{backgroundColor: 'rgba(255,255,255,.6)', borderRadius: '4px', marginTop: '20px'}}>
          <h3 style={{textAlign: 'center', 'fontWeight': 'lighter'}}>Add materials to purchase order #{row.object_number}</h3>
          <div className="row">
            <div className="pageItem col-md-6">
              <label className="itemLabel">Material</label>
              <div>
                <ComboBox
                  items={this.props.materials}
                  label='resource_description'
                    // defaultValue={this.props.materials[0]}
                  onChange={(newValue) =>
                    {
                      // get selected value
                      const selected_mat = JSON.parse(newValue);

                      this.unit_cost.value = selected_mat.resource_value;

                      // create po_item obj
                      const po_item =
                      {
                        item_number: row.resources ? row.resources.length : 0,
                        purchase_order_id: row._id,
                        item_id: selected_mat._id,
                        unit_cost: selected_mat.resource_value,
                        quantity: 1,
                        unit: selected_mat.unit,
                        item_description: selected_mat.resource_description
                      };

                      // update state
                      this.setState({new_po_item: po_item});
                    }}
                />
              </div>
            </div>

            <div className="pageItem col-md-6">
              <label className="itemLabel">Unit Cost</label>
              <input
                id="unit_cost"
                ref={(unit_cost)=>this.unit_cost=unit_cost}
                name="unit_cost"
                type="text"
                value={this.state.new_po_item.unit_cost}
                onChange={(new_val)=> {
                    const po_item = this.state.new_po_item;
                    
                    po_item.unit_cost = new_val.currentTarget.value;
                    this.setState({new_po_item: po_item});
                  }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>
          </div>

          <div className="row">
            <div className="pageItem col-md-6">
              <label className="itemLabel">Quantity</label>
              <input
                name="quantity"
                type="number"
                value={this.state.new_po_item.quantity}
                onChange={(new_val)=> {
                    const po_item = this.state.new_po_item;
                    
                    po_item.quantity = new_val.currentTarget.value;
                    this.setState({new_po_item: po_item});
                  }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>

            <div className="pageItem col-md-6">
              <label className="itemLabel">Unit</label>
              <input
                name="unit"
                type="text"
                disabled
                value={this.state.new_po_item.unit}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>
          </div>
          <div style={{width: '300px', marginLeft: 'auto', marginRight: 'auto', marginTop: '15px'}}>
            <CustomButton
              success
              style={{width: '120px', height: '50px', float: 'left'}}
              onClick={() =>
              {
                if(this.state.new_po_item.item_id && this.state.new_po_item.purchase_order_id)
                {
                  const po_item = this.state.new_po_item;

                  po_item.date_logged = new Date().getTime(); // current date in epoch msec
                  po_item.logged_date = formatDate(new Date()); // current date
                  po_item.creator = SessionManager.session_usr.usr;
                  console.log('creating new po item: ', po_item);

                  row.resources.push(po_item);
                  // update state
                  this.setState({new_po_item: po_item});
                  // signal add po item
                  this.props.dispatch({
                    type: ACTION_TYPES.PURCHASE_ORDER_ITEM_ADD,
                    payload: po_item
                  });

                  // TODO: fix this hack
                  // signal update po - so it saves to local storage
                  this.props.dispatch({
                    type: ACTION_TYPES.PURCHASE_ORDER_UPDATE,
                    payload: row
                  });
                  // this.setState(this.state.new_po_item);
                } else
                  openDialog(
                    {
                      type: 'warning',
                      title: 'Could not add material to po',
                      message: 'Please select a valid material from the drop down list'
                    }
                  );
                  /* buttons: [
                    t('common:yes'),
                    t('common:noThanks')
                  ] */
              }}
            >Add
            </CustomButton>
            <CustomButton style={{width: '120px', height: '50px', float: 'left', marginLeft: '15px'}} danger>Reset Fields</CustomButton>
          </div>
        </div> 
      </div>
    );
    // console.log('-<><><><><>:-< ', row.resources)
    return  (
      row.resources.length === 0 ? (
        <div>
          { po_options }
          <Message danger text='Purchase Order has no resources.' />
          {/* form for adding a new PurchaseOrderItem */}
          {new_po_item_form}
        </div>
      ) :
        <div style={{maxHeight: 'auto'}}>
          { po_options }
          <h3 style={{textAlign: 'center', 'fontWeight': 'lighter'}}>List of materials for purchase order #{row.object_number}</h3>
          <BootstrapTable
            id='tblPurchaseOrderResources'
            data={row.resources}
            striped
            hover
            insertRow={false}
            cellEdit={cellEditProp}
            options={options}
            // onScroll={}
            version='4' // bootstrap version
          >
            <TableHeaderColumn
              isKey
              dataField='item_number'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_object_number_visible}
            > Item Number
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='item_description'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_object_number_visible}
            > Item Description
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='unit_cost'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_supplier_id_visible}
            > Unit Cost
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='quantity'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_contact_person_id_visible}
            > Quantity
            </TableHeaderColumn>
            
            <TableHeaderColumn
              dataField='unit'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_sitename_visible}
            >  Measurement/Unit
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='additional_costs'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_request_visible}
            > Extra Costs
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='other'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              hidden
            > Notes
            </TableHeaderColumn>
          </BootstrapTable>

          {/* form for adding a new PurchaseOrderItem */}
          {new_po_item_form}
        </div>
    );
  }

  expandColumnComponent({ isExpandableRow, isExpanded })
  {
    if (isExpandableRow)
    {
      if(isExpanded)
        return (<span className="ion-arrow-down-b" />);
      return (<span className="ion-arrow-right-b" />);
    } 
    return(<span />);
  }

  toggleColumnVisibility()
  {
    // alert(this.getState().col_id_visible);
    // let cur = 0;
    let id_end = 190;
    if(this.state.col_id_visible)
    {
      id_end += this.col_width;
    }
    // alert('id col ends at ' + id_end)
    // cur += this.state.col_id_end;

    this.setState(
    {
      col_id_end: id_end,// this.state.col_id_visible ? 190 + this.col_width : 190,
      col_object_number_end: this.state.col_object_number_visible ? this.state.col_id_end + this.col_width : this.state.col_id_end
    });
  }

  openModal()
  {
    this.setState({ is_new_purchase_order_modal_open: true });
  }
 
  afterOpenModal()
  {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#2FA7FF';
  }
 
  closeModal()
  {
    this.setState({is_new_purchase_order_modal_open: false});
  }

  // Render
  render()
  {
    const { purchaseOrders, t } = this.props;
    
    const cellEditProp =
    {
      mode: 'click',
        // if product id less than 3, will cause the whole row noneditable
        // this function should return an array of row keys
        // purchaseOrders.filter(q => q.id < 3).map(p => p.id)
      nonEditableRows: () => ['_id', 'object_number', 'date_logged', 'creator', 'creator_name'],
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
    };

    const options =
    {
      defaultSortName: 'object_number',  // default sort column name
      defaultSortOrder: 'desc',
      expandRowBgColor: 'rgba(0, 0, 0, .4)'
    };

    // const supplierFormatter = (cell, row) => (<div>test</div>);
    const supplierFormatter = (cell, row) => `<i class='glyphicon glyphicon-${cell.supplier_name}'></i> ${cell.supplier_name}`;

    const info = (
      <div style={{position: 'fixed', display: this.state.info.display, top: this.state.info.y, left: this.state.info.x, background:'rgba(0,0,0,.8)', borderRadius: '4px', boxShadow: '0px 0px 10px #343434', border: '1px solid #000', zIndex: '300'}}>
        <p style={{color: '#fff', marginTop: '5px'}}>&nbsp;click&nbsp;to&nbsp;sort&nbsp;by&nbsp;this&nbsp;column&nbsp;</p>
      </div>);

    return (
      <PageContent bare>
        <div style={{maxHeight: 'auto'}}>
          {info}
          {/* PurchaseOrder Creation Modal */}
          <Modal
            isOpen={this.state.is_new_purchase_order_modal_open}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={modalStyle}
            contentLabel="New PurchaseOrder Modal"
          >
            <h2 ref={subtitle => this.subtitle = subtitle} style={{color: 'black'}}>Create New Purchase Order</h2>
            <div>
              <div className="pageItem">
                {/* <label className="itemLabel">{t('settings:fields:logo:name')}</label>
                  <Logo
                    logo={this.state.logo}
                    handleLogoChange={this.handleLogoChange}
                  /> */}
              </div>
              <div className="row">
                <div className="pageItem col-md-6">
                  <label className="itemLabel"> Contact </label>
                  {/* TODO: common:fields:email? */}
                  <div>
                    <ComboBox 
                      ref={(cbx_contacts)=>this.cbx_contacts = cbx_contacts}
                      items={this.props.employees}
                      // selected_item={this.state.new_purchase_order.contact}
                      label='name'
                      onChange={(new_val)=>{
                        const selected_contact = JSON.parse(new_val);
                        const purchaseOrder = this.state.new_purchase_order;
                        purchaseOrder.contact_id = selected_contact.usr;
                        purchaseOrder.contact = selected_contact;

                        this.setState({new_purchase_order: purchaseOrder});
                      }}
                    />
                  </div>
                </div>

                <div className="pageItem col-md-6">
                  <label className="itemLabel">Supplier</label>
                  <div>
                    <ComboBox
                      ref={(cbx_suppliers)=>this.cbx_suppliers = cbx_suppliers}
                      items={this.props.suppliers}
                      // selected_item={this.state.new_purchase_order.supplier}
                      label='supplier_name'
                      onChange={(new_val)=>{
                        const selected_supplier = JSON.parse(new_val);
                        
                        const purchaseOrder = this.state.new_purchase_order;
                        purchaseOrder.supplier_id = selected_supplier._id;
                        purchaseOrder.supplier = selected_supplier;

                        this.setState({new_purchase_order: purchaseOrder});
                        this.sitename = selected_supplier.physical_address;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="pageItem col-md-6">
                  <label className="itemLabel">VAT [{this.state.new_purchase_order.vat} %]</label>
                  <label className="switch">
                    <input
                      name="vat"
                      type="checkbox"
                      checked={this.state.new_purchase_order.vat>0}
                      onChange={() =>
                        {
                          const purchaseOrder = this.state.new_purchase_order;
                          purchaseOrder.vat = purchaseOrder.vat > 0 ? 0 : GlobalConstants.VAT;
                          this.setState(
                          {
                            new_purchase_order: purchaseOrder
                          });
                        }}
                    />
                    <span className="slider round" />
                  </label>
                </div>

                <div className="pageItem col-md-6">
                  <label className="itemLabel">Notes</label>
                  <textarea
                    name="notes"
                    value={this.state.new_purchase_order.other}
                    onChange={this.handleInputChange}
                    style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>

              <CustomButton
                onClick={this.closeModal}
                style={{width: '120px', height: '50px', float: 'right'}}
                danger
              >Dismiss
              </CustomButton>

              <CustomButton
                onClick={()=>{
                  const purchase_order = this.state.new_purchase_order;

                  if(!purchase_order.supplier)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid supplier selected',
                      },
                    });
                  }

                  if(!purchase_order.contact)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid contact person selected',
                      },
                    });
                  }

                  // Prepare PO
                  const supplier_name = purchase_order.supplier.supplier_name.toString();

                  // purchase_order.object_number = this.props.purchase_orders.length;
                  purchase_order.supplier_name = supplier_name;
                  purchase_order.supplier_id = purchase_order.supplier._id;
                  purchase_order.contact_person = purchase_order.contact.name;
                  purchase_order.contact_person_id = purchase_order.contact.usr;
                  purchase_order.account_name = supplier_name.toLowerCase().replace(' ', '-');
                  purchase_order.creator_name = SessionManager.session_usr.name;
                  purchase_order.creator = SessionManager.session_usr.usr;
                  purchase_order.creator_employee = SessionManager.session_usr;
                  purchase_order.date_logged = new Date().getTime();// current date in epoch ms
                  purchase_order.logged_date = formatDate(new Date()); // current date

                  this.setState({new_purchase_order: purchase_order, is_new_purchase_order_modal_open: false});

                  this.props.purchaseOrders.push(this.state.new_purchase_order);

                  mapStateToProps(this.state);

                  // this.props.dispatch({
                  //   type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                  //   payload: {
                  //     type: 'success',
                  //     message: 'Successfully created new purchase_order',
                  //   },
                  // });

                  // dispatch action to create purchase_order on local & remote stores
                  this.props.dispatch({
                    type: ACTION_TYPES.PURCHASE_ORDER_NEW,
                    payload: this.state.new_purchase_order
                  });
                  
                }}
                style={{width: '120px', height: '50px', float: 'left'}}
                success
              >Create
              </CustomButton>
            </div>
          </Modal>

          {/* PurchaseOrders table & Column toggles */}
          <div style={{paddingTop: '0px'}}>
            <Transition
              component={false}
              enter={{
                translateY: this.state.column_toggles_top
              }}
              leave={{
                translateY: this.state.column_toggles_top
              }}
              ref={(el)=> this.col_toggles_container = el}
              style={{
                zIndex: '10',
                background: 'rgb(180, 180, 180)',
                left: window.innerWidth * 0.010 + '%',
              }}
            >  
              <div key='col_toggle' style={{boxShadow: '0px 10px 35px #343434', position: 'fixed', top:  '130px', width: '1175px', zIndex: '20'}}>
                <h2 style={{textAlign: 'center', fontWeight: 'lighter'}}>Show/Hide Table Columns</h2>
                <Part>
                  <Row>
                    {/* ID column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">PO&nbsp;ID</label>
                      <label className="switch">
                        <input
                          name="col_toggle_purchaseOrderID"
                          type="checkbox"
                          checked={this.state.col_id_visible}
                          onChange={() =>
                          {
                            const is_id_visible = !this.state.col_id_visible;
                            this.setState(
                            {
                              col_id_visible: is_id_visible,
                              col_id_end: is_id_visible ? 190 + this.col_width : 190
                              // col_id_end: this.state.col_id_visible ? 190: 380
                            });
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Object # column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">PO&nbsp;No.</label>
                      <label className="switch">
                        <input
                          name="col_toggle_purchaseOrderNumber"
                          type="checkbox"
                          checked={this.state.col_object_number_visible}
                          onChange={() =>
                          {
                            const is_num_visible = !this.state.col_object_number_visible;

                            this.setState(
                            {
                              col_object_number_visible: is_num_visible,
                              col_object_number_end: is_num_visible ? this.col_id_end + this.col_width : this.col_id_end
                              // col_object_number_end: this.state.col_object_number_visible ? this.state.col_id_end : this.state.col_id_end + 190
                            });
                            this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Supplier column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Supplier</label>
                      <label className="switch">
                        <input
                          name="col_toggle_supplierID"
                          type="checkbox"
                          checked={this.state.col_supplier_id_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_supplier_id_visible: !this.state.col_supplier_id_visible
                            });
                            this.toggleColumnVisibility();
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Contact column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Contact</label>
                      <label className="switch">
                        <input
                          name="col_toggle_contactID"
                          type="checkbox"
                          checked={this.state.col_contact_person_id_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_contact_person_id_visible: !this.state.col_contact_person_id_visible
                            });
                            this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* VAT column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">VAT</label>
                      <label className="switch">
                        <input
                          name="col_toggle_vat"
                          type="checkbox"
                          checked={this.state.col_vat_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_vat_visible: !this.state.col_vat_visible
                            });
                            this.toggleColumnVisibility();
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Status column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Status</label>
                      <label className="switch">
                        <input
                          name="status"
                          type="checkbox"
                          checked={this.state.col_status_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_status_visible: !this.state.col_status_visible
                            });
                            this.toggleColumnVisibility();
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Creator column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Creator</label>
                      <label className="switch">
                        <input
                          name="creator"
                          type="checkbox"
                          checked={this.state.col_creator_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_creator_visible: !this.state.col_creator_visible
                            });
                            this.toggleColumnVisibility();
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Date Logged column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Date&nbsp;Logged</label>
                      <label className="switch">
                        <input
                          name="date_logged"
                          type="checkbox"
                          checked={this.state.col_date_logged_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_date_logged_visible: !this.state.col_date_logged_visible
                            });
                            this.toggleColumnVisibility();
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>
                  </Row>
                  <Row>
                    <CustomButton onClick={this.openModal} success>Create New PurchaseOrder</CustomButton>
                    <CustomButton
                      success
                      style={{marginLeft: '20px'}}
                      onClick={() => 
                      {
                        if(this.state.column_toggles_top < -80)
                          this.setState({column_toggles_top: -80});
                        else
                          this.setState({column_toggles_top: -200});
                      }}
                    >
                  Toggle Filters
                    </CustomButton>
                  </Row>
                </Part>
              </div>
            </Transition>

            {/* List of PurchaseOrders */}
            {purchaseOrders.length === 0 ? (
              <Message danger text='No purchaseOrders were found in the system' style={{marginTop: '145px'}} />
            ) : (
              <div style={{maxHeight: 'auto', marginTop: '5px', backgroundColor: '#eeeeee'}}>
                <BootstrapTable
                  id='tblPurchaseOrders'
                  data={purchaseOrders}
                  striped
                  hover
                  insertRow={false}
                  // selectRow={(row)=>alert(row)}
                  selectRow={{bgColor: 'red'}}
                  expandableRow={this.isExpandableRow}
                  expandComponent={this.expandComponent}
                  trStyle={(row) => ({background: 'rgba(255, 128, 23, .6)'})}
                  expandColumnOptions={{
                    expandColumnVisible: true,
                    expandColumnComponent: this.expandColumnComponent,
                    columnWidth: 50}}
                  cellEdit={cellEditProp}
                  dataFormatter={supplierFormatter}
                  options={options}
                  // onScroll={}
                  version='4' // bootstrap version
                >
                  <TableHeaderColumn  
                    dataField='_id'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', left: '190px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_id_visible}
                  > PO ID
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    isKey
                    dataField='object_number'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={() => {this.state.col_id_visible?({position: 'fixed', background: 'red' }):({background: 'lime'})}}
                    // thStyle={this.state.col_id_visible?{position: 'fixed', left: '400px',background: 'lime'}:{position: 'fixed', background: 'red'}}
                    // thStyle={{position: 'fixed', left: this.state.col_id_end + 'px', background: 'lime'}}
                    tdStyle={() => {({'fontWeight': 'lighter'})}}
                    hidden={!this.state.col_object_number_visible}
                  > PO&nbsp;Number
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='supplier_name'
                    dataSort
                    caretRender={this.getCaret}
                    // editable={{type: 'select'}}
                    customEditor={{
                      getElement: (func, props) =>
                        <ComboBox items={this.props.suppliers} selected_item={props.row.supplier} label='supplier_name' />
                    }}
                    // thStyle={{position: 'fixed', left: this.state.col_id_end + 240 + 'px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_supplier_id_visible}
                  > Supplier
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='contact_person'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_contact_person_id_visible}
                    customEditor={{
                      getElement: (func, props) =>
                        <ComboBox items={this.props.employees} selected_item={props.row.contact} label='name' />
                    }}
                  > Contact&nbsp;Person
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='vat'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_vat_visible}
                  > VAT
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='status_description'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_status_visible}
                  > Status
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='creator_name'
                    dataSort
                    ref={this.creator_ref}
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', right: this.width, border: 'none' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_creator_visible}
                  > Creator
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='logged_date'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', right: '-20px', border: 'none' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_date_logged_visible}
                  > Date&nbsp;Logged
                  </TableHeaderColumn>
                </BootstrapTable>
              </div>
            )}
          </div>
        </div>
      </PageContent>
    );
  }
}

// PropTypes Validation
PurchaseOrders.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  materials: PropTypes.arrayOf(PropTypes.object).isRequired,
  suppliers: PropTypes.arrayOf(PropTypes.object).isRequired,
  purchaseOrders: PropTypes.arrayOf(PropTypes.object).isRequired,
   t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
  employees: getEmployees(state),
  purchaseOrders: getPurchaseOrders(state),
  suppliers: getSuppliers(state),
  materials: getMaterials(state)
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(PurchaseOrders);
