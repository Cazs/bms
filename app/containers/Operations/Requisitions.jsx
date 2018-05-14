// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const openDialog = require('../../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;

import { translate } from 'react-i18next';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';

// Actions
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Helpers
import sessionManager from '../../helpers/SessionManager';
import Log, { formatDate } from '../../helpers/Logger';
// import Material from '../../helpers/Material';
import statuses from '../../helpers/statuses';

// Animation
import { Motion, spring } from 'react-motion';
import Transition from 'react-motion-ui-pack'

// Global constants
import * as GlobalConstants from  '../../constants/globals';

// Selectors
import { getEmployees } from '../../reducers/HR/EmployeesReducer';
import { getMaterials } from '../../reducers/Operations/MaterialsReducer';
import { getSuppliers } from '../../reducers/Operations/SuppliersReducer';
import { getClients } from '../../reducers/Operations/ClientsReducer';
import { getRequisitions } from '../../reducers/Operations/RequisitionsReducer';
import { getPurchaseOrders } from '../../reducers/Operations/PurchaseOrdersReducer';
import { getCurrentSettings } from '../../../app/reducers/SettingsReducer';

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
import
{
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../../components/shared/Layout';


const modalStyle =
{
  content :
  {
    top                   : '15%',
    left                  : '7%',
    right                 : 'auto',
    bottom                : 'auto',
    border                : '2px solid black',
    minWidth              : window.outerWidth-160
  }
};

export class Requisitions extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.editRequisition = this.editRequisition.bind(this);
    this.deleteRequisition = this.deleteRequisition.bind(this);
    this.duplicateRequisition = this.duplicateRequisition.bind(this);
    this.setRequisitionStatus = this.setRequisitionStatus.bind(this);
    this.expandComponent = this.expandComponent.bind(this);
    this.getCaret = this.getCaret.bind(this);
    this.newRequisition = this.newRequisition.bind(this);
    this.newPO = this.newPO.bind(this);
    this.handleRequisitionUpdate = this.handleRequisitionUpdate.bind(this);
    
    // this.creator_ref = React.createRef();
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.col_toggles_container = null;
    this.col_width = 235;
    this.state =
    { 
      filter: null,
      is_new_requisition_modal_open: false,
      is_requisition_items_modal_open: false,
      selected_requisition: null,
      active_row: null,
      column_toggles_top: -200,
      info: {x: 200, y: 200, display: 'none'},
      new_requisition: this.newRequisition(),
      // Table Column Toggles
      col_id_visible: false,
      col_object_number_visible: true,
      col_supplier_id_visible: true,
      col_contact_person_id_visible: false,
      col_description_visible: false,
      col_type_visible: false,
      col_status_visible: true,
      col_creator_visible: false,
      col_date_logged_visible: false
    };
  }

  newRequisition()
  {
    return {
      supplier_name: null,
      supplier_id: null,
      contact: {},
      contact_person: null,
      contact_person_id: null,
      description: '',
      status: 0,
      vat: GlobalConstants.VAT,
      status_description: 'Pending',
      resources: [],
      creator_name: sessionManager.getSessionUser().name,
      creator: sessionManager.getSessionUser().usr,
      creator_employee: sessionManager.getSessionUser(),
      date_logged: new Date().getTime(), // current date in epoch ms
      logged_date: formatDate(new Date()), // current date
      other: ''
    }
  }

  // Load Requisitions & add event listeners
  componentDidMount()
  {
    // Add Event Listener
    ipc.on('confirmed-delete-requisition', (event, index, requisitionId) =>
    {
      if (index === 0)
      {
        this.confirmedDeleteRequisition(requisitionId);
      }
    });
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount()
  {
    ipc.removeAllListeners('confirmed-delete-requisition');
  }

  // Open Confirm Dialog
  deleteRequisition(requisitionId)
  {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteRequisition:title'),
        message: t('dialog:deleteRequisition:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-requisition',
      requisitionId
    );
  }

  // Confirm Delete an requisition
  confirmedDeleteRequisition(requisitionId)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.deleteRequisition(requisitionId));
  }

  // set the requisition status
  setRequisitionStatus(requisitionId, status)
  {
    alert('set status to: ' + status);
    const { dispatch } = this.props;
    // dispatch(Actions.setRequisitionStatus(requisitionId, status));
  }

  editRequisition(requisition)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.editRequisition(requisition));
  }

  duplicateRequisition(requisition)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.duplicateRequisition(requisition));
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

  handleRequisitionUpdate(evt, requisition)
  {
    if(!evt || evt.key === 'Enter')
    {
      if(sessionManager.getSessionUser().access_level > GlobalConstants.ACCESS_LEVELS[1].level)
      {
        Log('verbose_info', 'updating requisition: ' +  requisition);
        // if(requisition.status == 1)
        // {
        //   this.props.dispatch(
        //   {
        //     type: ACTION_TYPES.UI_NOTIFICATION_NEW,
        //     payload: {type: 'danger', message: 'This requisition has already been authorised and can no longer be changed.'}
        //   });
        //   return;
        // }
        this.props.dispatch(
        {
          type: ACTION_TYPES.REQUISITION_UPDATE,
          payload: Object.assign(requisition, { last_updated_by_employee: sessionManager.getSessionUser().name, last_updated_by: sessionManager.getSessionUser().usr })
        });
      } else
      {
        this.props.dispatch(
        {
          type: ACTION_TYPES.UI_NOTIFICATION_NEW,
          payload: {type: 'danger', message: 'You are not authorised to update the state of this requisition.'}
        });
      }
    }
  }

  newPO(requisition)
  {
    // Prepare PO
    const purchase_order = {};
    const supplier_name = requisition.supplier.supplier_name.toString();

    purchase_order.supplier_name = supplier_name;
    purchase_order.object_number = this.props.purchaseOrders.length;
    purchase_order.supplier_id = requisition.supplier._id;
    purchase_order.supplier = requisition.supplier;
    purchase_order.contact_person = requisition.contact.name;
    purchase_order.contact_person_id = requisition.contact.usr;
    purchase_order.account_name = supplier_name.toLowerCase().replace(' ', '-');
    purchase_order.reference = 'PO' + supplier_name.toUpperCase().replace(' ', '-');
    purchase_order.status = 0;
    purchase_order.vat = GlobalConstants.VAT;
    purchase_order.resources = [];
    purchase_order.status_description = 'Pending';
    purchase_order.creator_name = sessionManager.getSessionUser().name;
    purchase_order.creator = sessionManager.getSessionUser().usr;
    purchase_order.creator_employee = sessionManager.getSessionUser();
    purchase_order.date_logged = new Date().getTime();// current date in epoch ms
    purchase_order.logged_date = formatDate(new Date()); // current date

    // this.setState({new_purchase_order: this.newPO(), is_new_purchase_order_modal_open: false});

    this.props.purchaseOrders.push(purchase_order);

    // dispatch action to create purchase_order on local & remote stores
    this.props.dispatch(
    {
      type: ACTION_TYPES.PURCHASE_ORDER_NEW,
      payload: purchase_order
    });
  }

  expandComponent(row)
  {
    const requisition_options = (
      <div style={{padding: '10px'}}>
        <CustomButton primary onClick={() => this.newPO(row)}>New Purchase Order</CustomButton>
      </div>
    );

    return (
      <div>
        { requisition_options }
        <Message danger text='Requisition has no materials.' />
        {/* form for adding a new RequisitionItem */}
        {/* {new_req_item_form} */}
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

  openModal()
  {
    this.setState({ is_new_requisition_modal_open: true });
  }
 
  afterOpenModal()
  {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#2FA7FF';
  }
 
  closeModal()
  {
    this.setState({is_new_requisition_modal_open: false});
  }

  // Render
  render()
  {
    const { requisitions, t } = this.props;
    
    const cellEditProp =
    {
      mode: 'click',
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

    const clientFormatter = (cell, row) => `<i class='glyphicon glyphicon-${cell.client_name}'></i> ${cell.client_name}`;

    const info = (
      <div style={{position: 'fixed', display: this.state.info.display, top: this.state.info.y, left: this.state.info.x, background:'rgba(0,0,0,.8)', borderRadius: '4px', boxShadow: '0px 0px 10px #343434', border: '1px solid #000', zIndex: '300'}}>
        <p style={{color: '#fff', marginTop: '5px'}}>&nbsp;click&nbsp;to&nbsp;sort&nbsp;by&nbsp;this&nbsp;column&nbsp;</p>
      </div>);

    return (
      <PageContent bare>
        <div style={{maxHeight: 'auto'}}>
          {info}
          {/* Requisition Creation Modal */}
          <Modal
            isOpen={this.state.is_new_requisition_modal_open}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={modalStyle}
            contentLabel="New Requisition"
          >
            <h2 ref={subtitle => this.subtitle = subtitle} style={{color: 'black'}}>Create New Requisition</h2>
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
                  <label className="itemLabel">Contact</label>
                  {/* TODO: common:fields:email? */}
                  <div>
                    <ComboBox 
                      ref={(cbx_contacts)=>this.cbx_contacts = cbx_contacts}
                      items={this.props.employees}
                      // selected_item={this.state.new_requisition.contact}
                      label='name'
                      onChange={(new_val)=>
                      {
                        const selected_contact = JSON.parse(new_val.currentTarget.value);
                        const Requisition = this.state.new_requisition;
                        Requisition.contact_id = selected_contact.usr;
                        Requisition.contact = selected_contact;

                        this.setState({new_requisition: Requisition});
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
                      // selected_item={this.state.new_requisition.supplier}
                      label='supplier_name'
                      onChange={(new_val)=>{
                        const selected_supplier = JSON.parse(new_val.currentTarget.value);
                        
                        const Requisition = this.state.new_requisition;
                        Requisition.supplier_id = selected_supplier._id;
                        Requisition.supplier = selected_supplier;

                        this.setState({new_requisition: Requisition});
                        this.sitename = selected_supplier.physical_address;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="pageItem col-md-6">
                  <label className="itemLabel">Description</label>
                  <textarea
                    name="description"
                    value={this.state.new_requisition.description}
                    onChange={(new_val)=>
                    {
                      const requisition = this.state.new_requisition;
                      requisition.description = new_val.currentTarget.value;

                      this.setState({new_requisition: requisition});
                    }}
                    style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>

                <div className="pageItem col-md-6">
                  <label className="itemLabel">Notes</label>
                  <textarea
                    name="notes"
                    value={this.state.new_requisition.other}
                    onChange={(new_val)=>
                    {
                      const requisition = this.state.new_requisition;
                      requisition.other = new_val.currentTarget.value;

                      this.setState({new_requisition: requisition});
                    }}
                    style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>

              <div className='row'>
                <div className="pageItem col-lg-6 col-xs-6">
                  <label className="itemLabel">VAT [{this.state.new_requisition.vat} %]</label>
                  <label className="switch">
                    <input
                      name="vat"
                      type="checkbox"
                      checked={this.state.new_requisition.vat>0}
                      onChange={() =>
                        {
                          const requisition = this.state.new_requisition;
                          requisition.vat = requisition.vat > 0 ? 0 : GlobalConstants.VAT;
                          this.setState(
                          {
                            new_requisition: requisition
                          });
                        }}
                    />
                    <span className="slider round" />
                  </label>
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
                  const requisition = this.state.new_requisition;

                  if(!requisition.supplier)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid supplier selected',
                      },
                    });
                  }

                  if(!requisition.contact)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid contact person selected',
                      },
                    });
                  }

                  // Prepare Requisition
                  const supplier_name = requisition.supplier.supplier_name.toString();
                  const requisitions = this.props.requisitions;
                  requisition.supplier_name = supplier_name;
                  requisition.object_number = requisitions.length;
                  requisition.supplier_id = requisition.supplier._id;
                  requisition.contact_person = requisition.contact.name;
                  requisition.contact_person_id = requisition.contact.usr;
                  requisition.status = 0;
                  requisition.status_description = 'Pending';
                  requisition.creator_name = sessionManager.getSessionUser().name;
                  requisition.creator = sessionManager.getSessionUser().usr;
                  requisition.creator_employee = sessionManager.getSessionUser();
                  requisition.date_logged = new Date().getTime();// current date in epoch ms
                  requisition.logged_date = formatDate(new Date()); // current date

                  console.log('creating requisition: ', requisition);

                  requisitions.push(requisition);

                  this.setState({new_requisition: this.newRequisition(), is_new_requisition_modal_open: false});

                  // dispatch action to create requisition on local & remote stores
                  this.props.dispatch(
                  {
                    type: ACTION_TYPES.REQUISITION_NEW,
                    payload: requisition,
                    // callback(complete_requisition) // w/ _id
                    // {
                    //   if(complete_requisition)
                    //     requisitions.push(complete_requisition);
                    // }
                  });
                  
                }}
                style={{width: '120px', height: '50px', float: 'left'}}
                success
              >Create
              </CustomButton>
            </div>
          </Modal>
          {/* Requisitions table & Column toggles */}
          <div style={{paddingTop: '0px'}}>
            {/* Requisitions Table column toggles */}
            <Transition
              component={false}
              enter={{
                translateY: this.state.column_toggles_top,
                // translateX: (window.innerWidth * 0.09)
              }}
              leave={{
                translateY: this.state.column_toggles_top,
                // translateX: (window.innerWidth * 0.09)
              }}
              ref={(el)=> this.col_toggles_container = el}
              style={{
                position: 'fixed',
                zIndex: '10',
                background: 'rgb(180, 180, 180)',
                left: window.innerWidth * 0.010 + '%'
              }}
            >  
              {/* , maxWidth: (window.innerWidth * 0.82) + 'px' */}
              {/* { window.onresize = () => {
                Object.assign(this.toggle_container.style, {marginLeft: (-45 + (window.outerWidth * 0.01)) + 'px'});
              }} */}
              <div ref={(r)=>this.toggle_container = r} key='requisitions_col_toggles' style={{boxShadow: '0px 10px 35px #343434', position: 'fixed', top:  '130px', width: '1150px', marginLeft: 'auto', marginRight: 'auto', zIndex: '20'}}>
                <h2 style={{textAlign: 'center', fontWeight: 'lighter'}}>Show/Hide Table Columns</h2>
                <Part>
                  <Row>
                    {/* ID column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Requisition&nbsp;ID</label>
                      <label className="switch">
                        <input
                          name="requisition_toggle_requisition_id"
                          type="checkbox"
                          checked={this.state.col_id_visible}
                          onChange={() =>
                          {
                            const is_id_visible = !this.state.col_id_visible;
                            this.setState(
                            {
                              col_id_visible: is_id_visible,
                              col_id_end: is_id_visible ? 190 + this.col_width : 190
                            });
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Object # column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Requisition&nbsp;No.</label>
                      <label className="switch">
                        <input
                          name="requisition_toggle_requisition_number"
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
                            // this.toggleColumnVisibility()
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
                          name="requisition_toggle_supplier_id"
                          type="checkbox"
                          checked={this.state.col_supplier_id_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_supplier_id_visible: !this.state.col_supplier_id_visible
                            });
                            // this.toggleColumnVisibility()
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
                          name="requisition_toggle_contact_id"
                          type="checkbox"
                          checked={this.state.col_contact_person_id_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_contact_person_id_visible: !this.state.col_contact_person_id_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Sitename column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Description</label>
                      <label className="switch">
                        <input
                          name="requisition_toggle_description"
                          type="checkbox"
                          checked={this.state.col_description_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_description_visible: !this.state.col_description_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Requisition type column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Type</label>
                      <label className="switch">
                        <input
                          name="requisition_toggle_type"
                          type="checkbox"
                          checked={this.state.col_type_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_type_visible: !this.state.col_type_visible
                            });
                            // this.toggleColumnVisibility()
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
                          name="toggle_status"
                          type="checkbox"
                          checked={this.state.col_status_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_status_visible: !this.state.col_status_visible
                            });
                            // this.toggleColumnVisibility()
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
                          name="toggle_creator"
                          type="checkbox"
                          checked={this.state.col_creator_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_creator_visible: !this.state.col_creator_visible
                            });
                            // this.toggleColumnVisibility()
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
                          name="toggle_date_logged"
                          type="checkbox"
                          checked={this.state.col_date_logged_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_date_logged_visible: !this.state.col_date_logged_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>
                  </Row>
                  <Row>
                    <CustomButton onClick={this.openModal} success>Create New Requisition</CustomButton>
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

            {/* List of Requisitions */}
            {requisitions.length === 0 ? (
              <Message danger text='No requisitions were found in the system' style={{marginTop: '145px'}} />
            ) : (
              <div style={{maxHeight: 'auto', marginTop: '0px', marginLeft: '-40px', backgroundColor: '#eeeeee'}}>
                <BootstrapTable
                  id='tblRequisitions'
                  key='tblRequisitions'
                  data={requisitions}
                  striped
                  hover
                  insertRow={false}
                  selectRow={{bgColor: 'red'}}
                  expandableRow={this.isExpandableRow}
                  expandComponent={this.expandComponent}
                  trStyle={(row) => ({background: '#ff7400'})}
                  expandColumnOptions={{
                    expandColumnVisible: true,
                    expandColumnComponent: this.expandColumnComponent,
                    columnWidth: 50}}
                  cellEdit={cellEditProp}
                  dataFormatter={clientFormatter}
                  options={options}
                  // onScroll={}
                  version='4' // bootstrap version
                >
                  <TableHeaderColumn  
                    // isKey
                    dataField='_id'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', left: '190px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_id_visible}
                    editable={false}
                  > Requisition&nbsp;ID
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
                    editable={false}
                  > Requisition&nbsp;Number
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='supplier_name'
                    dataSort
                    caretRender={this.getCaret}
                    // editable={{type: 'select'}}
                    customEditor={{
                      getElement: (func, props) =>
                      (
                        <ComboBox
                          items={this.props.suppliers}
                          selected_item={props.row.supplier}
                          label='supplier_name'
                          onChange={(evt)=>
                          {
                            if(sessionManager.getSessionUser().access_level <= GlobalConstants.ACCESS_LEVELS[1].level)
                            {
                              // revert combo box selection
                              // this.cbx_status.state.selected_item = props.row.supplier;

                              this.props.dispatch(
                              {
                                type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                                payload: {type: 'danger', message: 'You are not authorised to update the state of this requisition.'}
                              });

                              // this.cbx_status.blur();
                              return;
                            }
                            const selected_supplier = JSON.parse(evt.currentTarget.value);
                            console.log('selected_supplier: ', selected_supplier);
                            const selected_requisition = props.row;
                            selected_requisition.supplier_id = selected_supplier._id;
                            selected_requisition.supplier = selected_supplier;
                            selected_requisition.supplier_name = selected_supplier.supplier_name;

                            // send signal to update requisition on local & remote storage
                            this.props.dispatch(
                            {
                              type: ACTION_TYPES.REQUISITION_UPDATE,
                              payload: selected_requisition
                            });
                            console.log('dispatched requisition update');
                          }}
                        />
                      )
                    }}
                    // thStyle={{position: 'fixed', left: this.state.col_id_end + 240 + 'px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_supplier_id_visible}
                  >Supplier
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
                      (
                        <ComboBox
                          items={this.props.employees}
                          selected_item={props.row.contact}
                          label='name'
                          onChange={(evt)=>
                          {
                            if(sessionManager.getSessionUser().access_level <= GlobalConstants.ACCESS_LEVELS[1].level)
                            {
                              // revert combo box selection
                              // this.cbx_status.state.selected_item = props.row.supplier;

                              this.props.dispatch(
                              {
                                type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                                payload: { type: 'danger', message: 'You are not authorised to update the state of this requisition.'}
                              });

                              // this.cbx_status.blur();
                              return;
                            }
                            const selected_contact = JSON.parse(evt.currentTarget.value);
                            console.log('selected contact person: ', selected_contact);
                            const selected_requisition = props.row;
                            selected_requisition.contact_person_id = selected_contact.usr;
                            selected_requisition.contact = selected_contact;
                            selected_requisition.contact_person = selected_contact.name;

                            // send signal to update requisition on local & remote storage
                            this.props.dispatch(
                            {
                              type: ACTION_TYPES.REQUISITION_UPDATE,
                              payload: selected_requisition
                            });
                            console.log('dispatched requisition update');
                          }}
                        />
                      )
                    }}
                  >Contact&nbsp;Person
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='description'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_description_visible}
                    customEditor={{
                      getElement: (func, props) =>
                      (
                        <textarea
                          defaultValue={props.row.description}
                          style={{border: '1px solid lime', borderRadius: '2px'}}
                          onChange={(val) =>
                          {
                            if(sessionManager.getSessionUser().access_level <= GlobalConstants.ACCESS_LEVELS[1].level) // standard access and less are not allowed
                              return this.props.dispatch(UIActions.newNotification('danger', 'You are not authorised to update the state of this requisition.'));

                            const select_requisition = props.row;
                            select_requisition.description = val.currentTarget.value;
                            this.setState( { selected_requisition: select_requisition })
                          }}
                          
                          onKeyPress={(evt) =>
                          {
                            if(!evt || evt.key === 'Enter')
                            {
                              this.props.dispatch(
                              {
                                type: ACTION_TYPES.REQUISITION_UPDATE,
                                payload: this.state.selected_requisition
                              });
                            }
                          }}
                        />
                      )
                    }}
                  > Description
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='type'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_type_visible}
                  > Type
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='status_description'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_status_visible}
                    customEditor={{
                      getElement: (func, props) =>
                      {
                        const selected_requisition = props.row;
                        
                        return (<ComboBox
                          ref={(cbx_status)=>this.cbx_status = cbx_status}
                          items={statuses}
                          // value={GlobalConstants.ACCESS_LEVELS[selected_po.status]}
                          selected_index={selected_requisition.status} // {GlobalConstants.ACCESS_LEVELS[1]}
                          label='status_description'
                          onChange={(new_val)=>
                          {
                              const selected_status = JSON.parse(new_val.currentTarget.value);
                              console.log(selected_status);
                              console.log(props.row);

                              if(sessionManager.getSessionUser().access_level <= GlobalConstants.ACCESS_LEVELS[1].level) // standard access and less are not allowed
                              {
                                // revert combo box selection
                                // this.cbx_status.state.selected_item = GlobalConstants.ACCESS_LEVELS[0];

                                this.props.dispatch(
                                {
                                  type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                                  payload: {type: 'danger', message: 'You are not authorised to update the state of this requisition.'}
                                });

                                // this.cbx_status.blur();
                                return;
                              }

                              console.log('selected status: ', selected_status);
                              selected_requisition.status = selected_status.status;
                              selected_requisition.status_description = selected_status.status_description;

                              // send signal to update po on local & remote storage
                              this.props.dispatch(
                              {
                                type: ACTION_TYPES.REQUISITION_UPDATE,
                                payload: selected_requisition
                              });
                              console.log('dispatched requisition update');
                          }}
                        />)
                      }
                    }}
                  >Status
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='creator_name'
                    dataSort
                    ref={this.creator_ref}
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', right: this.width, border: 'none' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_creator_visible}
                    editable={false}
                  > Creator
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='logged_date'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', right: '-20px', border: 'none' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_date_logged_visible}
                    editable={false}
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
Requisitions.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  materials: PropTypes.arrayOf(PropTypes.object).isRequired,
  suppliers: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  purchaseOrders: PropTypes.arrayOf(PropTypes.object).isRequired,
  requisitions: PropTypes.arrayOf(PropTypes.object).isRequired,
   t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
  employees: getEmployees(state),
  materials: getMaterials(state),
  clients: getClients(state),
  suppliers: getSuppliers(state),
  purchaseOrders: getPurchaseOrders(state),
  requisitions: getRequisitions(state)
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Requisitions);
