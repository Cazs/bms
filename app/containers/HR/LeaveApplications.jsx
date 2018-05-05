// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const openDialog = require('../../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;

import { translate } from 'react-i18next';

// Actions
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Helpers
import * as SessionManager from '../../helpers/SessionManager';
import Log, { formatDate } from '../../helpers/Logger';

// import Select from 'react-select';
import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';

// Animation
import { Motion, spring } from 'react-motion';
import Transition from 'react-motion-ui-pack'

// Global constants
import * as GlobalConstants from  '../../constants/globals';

// Selectors
import { getEmployees } from '../../reducers/HR/EmployeesReducer';
import { getMaterials } from '../../reducers/Operations/MaterialsReducer';
import { getClients } from '../../reducers/Operations/ClientsReducer';
import { getLeaveApplications } from '../../reducers/HR/LeaveApplicationsReducer';

// Components
import ComboBox from '../../components/shared/ComboBox';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
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
    minWidth              : window.outerWidth-160, // '950px'
  }
};

export class LeaveApplications extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.editLeave = this.editLeave.bind(this);
    this.deleteLeave = this.deleteLeave.bind(this);
    this.duplicateLeave = this.duplicateLeave.bind(this);
    this.setLeaveStatus = this.setLeaveStatus.bind(this);
    this.expandComponent = this.expandComponent.bind(this);
    
    // this.creator_ref = React.createRef();
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.col_toggles_container = null;
    this.col_width = 235;
    this.state =
    {
                    filter: null,
                    is_new_leave_modal_open: false,
                    is_leave_items_modal_open: false,
                    selected_leave: null,
                    active_row: null,
                    column_toggles_top: -200,
                    // Table Column Toggles
                    col_id_visible: false,
                    col_object_number_visible: true,
                    col_employee_visible: false,
                    col_start_date_visible: true,
                    col_end_date_visible: true,
                    col_return_date_visible: false,
                    col_type_visible: true,
                    col_status_visible: true,
                    col_creator_visible: false,
                    col_date_logged_visible: false,

                    new_leave_application:
                    {
                      usr: null,
                      type: null,
                      start_date: 0,
                      end_date: 0,
                      return_date: 0,
                      status: 0
                    }
    };
  }

  // Load LeaveApplications & add event listeners
  componentDidMount()
  {
    // Add Event Listener
    ipc.on('confirmed-delete-leave', (event, index, leaveId) =>
    {
      if (index === 0)
      {
        this.confirmedDeleteLeave(leaveId);
      }
    });
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount()
  {
    ipc.removeAllListeners('confirmed-delete-leave');
  }

  // Open Confirm Dialog
  deleteLeave(leaveId)
  {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteLeave:title'),
        message: t('dialog:deleteLeave:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-leave',
      leaveId
    );
  }

  // Confirm Delete an leave
  confirmedDeleteLeave(leaveId)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.deleteLeave(leaveId));
  }

  // set the leave status
  setLeaveStatus(leaveId, status)
  {
    alert('set status to: ' + status);
    const { dispatch } = this.props;
    // dispatch(Actions.setLeaveStatus(leaveId, status));
  }

  editLeave(leave)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.editLeave(leave));
  }

  duplicateLeave(leave)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.duplicateLeave(leave));
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
        <img src="../static/open-iconic-master/svg/caret-top.svg" alt='up' />
      );
    }
    if (direction === 'desc')
    {
      return (
        <img src="../static/open-iconic-master/svg/caret-bottom.svg" alt='down' />
      );
    }
    return (
      <span>
        <img src="../static/open-iconic-master/svg/info.svg" alt='info' style={{width: '13px', height: '13px', marginLeft: '10px'}} />
        (click&nbsp;to&nbsp;sort)
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
    return (<div />);
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
    this.setState({ is_new_leave_modal_open: true });
  }
 
  afterOpenModal()
  {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#2FA7FF';
  }
 
  closeModal()
  {
    this.setState({is_new_leave_modal_open: false});
  }

  // Render
  render()
  {
    const { leaveApplications, t } = this.props;
    
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

    return (
      <PageContent bare>
        <div style={{maxHeight: 'auto'}}>
          {/* LeaveApplication Creation Modal */}
          <Modal
            isOpen={this.state.is_new_leave_modal_open}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={modalStyle}
            contentLabel="New LeaveApplication Modal"
          >
            <h2 ref={subtitle => this.subtitle = subtitle} style={{color: 'black'}}>Create New LeaveApplication</h2>
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
                  <label className="itemLabel">Start Date </label>
                  <input
                    name="start_date"
                    type="date"
                    ref={(start_date)=>this.start_date=start_date}
                    defaultValue={formatDate(new Date())}
                    onChange={(new_val)=>
                    {
                      const leave_application = this.state.new_leave_application;
                      
                      leave_application.date_started = formatDate(new Date(new_val.currentTarget.value));
                      leave_application.start_date = leave_application.date_started.getTime();
                      
                      this.setState({new_leave_application: leave_application});
                    }}
                    style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>

                <div className="pageItem col-md-6">
                  <label className="itemLabel">End Date</label>
                  <input
                    name="end_date"
                    type="date"
                    ref={(end_date)=>this.end_date=end_date}
                    defaultValue={formatDate(new Date())}
                    onChange={(new_val)=>
                    {
                      const leave_application = this.state.new_leave_application;
                      
                      leave_application.date_ended = formatDate(new Date(new_val.currentTarget.value));
                      leave_application.end_date = leave_application.date_ended.getTime();
                      
                      this.setState({new_leave_application: leave_application});
                    }}
                    style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>
              
              <div className="row">
                <div className="pageItem col-md-6">
                  <label className="itemLabel">Leave Type</label>
                  <div>
                    <ComboBox
                      ref={(cbx_leave_type)=>this.cbx_leave_type = cbx_leave_type}
                      items={
                        [
                          {option_name: 'ANNUAL'},
                          {option_name: 'SICK'},
                          {option_name: 'UNPAID'},
                          {option_name: 'FAMILY RESPONSIBILITY - See BCEA for definition'}
                        ]}
                        // selected_item={this.state.new_leave_application.client}
                      label='option_name'
                      onChange={(new_val)=>{
                          const selected_type = JSON.parse(new_val);
                          
                          const leave_application = this.state.new_leave_application;
                          leave_application.type = selected_type.option_name;

                          this.setState({new_leave_application: leave_application});
                        }}
                    />
                  </div>
                </div>
                {/* this.state.new_job_task.scheduled_date.getFullYear() + '-' 
                      + ((this.state.new_job_task.scheduled_date.getMonth()+1) >= 10 ? this.state.new_job_task.scheduled_date.getMonth() + 1 : '0' + (this.state.new_job_task.scheduled_date.getMonth() + 1)) + '-'
                      + (this.state.new_job_task.scheduled_date.getDate() >= 10 ? this.state.new_job_task.scheduled_date.getDate() : '0' + this.state.new_job_task.scheduled_date.getDate()) */}
                <div className="pageItem col-md-6">
                  <label className="itemLabel">Notes</label>
                  <textarea
                    name="notes"
                    value={this.state.new_leave_application.other}
                    onChange={(evt)=>{
                      const leave_application = this.state.new_leave_application;
                      leave_application.other = evt.currentTarget.value;
                      this.setState({new_leave_application: leave_application});
                    }}
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
                  const leave_application = this.state.new_leave_application;

                  if(!leave_application.type)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid leave type',
                      },
                    });
                  }

                  if(!leave_application.start_date)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid start date',
                      },
                    });
                  }

                  if(!leave_application.end_date)
                  {
                    return this.props.dispatch({
                            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                            payload: {
                              type: 'danger',
                              message: 'Invalid end date',
                            },
                          });
                  }
                  
                  if(leave_application.start_date > leave_application.end_date)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Error: Invalid start & end dates. Start date has to be before end date',
                      },
                    });
                  }

                  // Prepare Leave Application
                  leave_application.usr = SessionManager.session_usr.usr;
                  leave_application.creator_name = SessionManager.session_usr.name;
                  leave_application.creator = SessionManager.session_usr.usr;
                  leave_application.creator_employee = SessionManager.session_usr;
                  leave_application.date_logged = new Date().getTime();// current date in epoch ms
                  leave_application.logged_date = formatDate(new Date()); // current date

                  this.setState({new_leave_application: leave_application, is_new_leave_modal_open: false});

                  this.props.leaveApplications.push(this.state.new_leave_application);
                  mapStateToProps(this.state);

                  // this.props.dispatch({
                  //   type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                  //   payload: {
                  //     type: 'success',
                  //     message: 'Successfully created new leave_application',
                  //   },
                  // });

                  // dispatch action to create leave_application on local & remote stores
                  this.props.dispatch({
                    type: ACTION_TYPES.LEAVE_NEW,
                    payload: this.state.new_leave_application
                  });
                  
                }}
                style={{width: '120px', height: '50px', float: 'left'}}
                success
              >Create
              </CustomButton>
            </div>
          </Modal>
          {/* LeaveApplications table & Column toggles */}
          <div style={{paddingTop: '0px'}}>
            {/* LeaveApplications Table column toggles */}
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
                // left: window.innerWidth * 0.010 + '%',
              }}
            >  
              {/* , maxWidth: (window.innerWidth * 0.82) + 'px' */}
              { window.onresize = () => {
                Object.assign(this.toggle_container.style, {marginLeft: (-45 + (window.outerWidth * 0.01)) + 'px'});
              }}
              <div ref={(r)=>this.toggle_container = r} key='leave_applications_col_toggles' style={{boxShadow: '0px 10px 35px #343434', marginLeft: '-35px', position: 'fixed', top:  '130px'}}>
                <h2 style={{textAlign: 'center', fontWeight: 'lighter'}}>Show/Hide Table Columns</h2>
                <Part>
                  <Row>
                    {/* ID column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Leave&nbsp;App&nbsp;ID</label>
                      <label className="switch">
                        <input
                          name="toggle_leave_id"
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
                      <label className="itemLabel">Leave&nbsp;App&nbsp;No.</label>
                      <label className="switch">
                        <input
                          name="toggle_leave_number"
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

                    {/* Employee column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Employee</label>
                      <label className="switch">
                        <input
                          name="toggle_employee"
                          type="checkbox"
                          checked={this.state.col_employee_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_employee_visible: !this.state.col_employee_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Start date column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Start&nbsp;date</label>
                      <label className="switch">
                        <input
                          name="toggle_start_date"
                          type="checkbox"
                          checked={this.state.col_start_date_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_start_date_visible: !this.state.col_start_date_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Request column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">End&nbsp;Date</label>
                      <label className="switch">
                        <input
                          name="toggle_end_date"
                          type="checkbox"
                          checked={this.state.col_end_date_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_end_date_visible: !this.state.col_end_date_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>
                    
                    {/* Date returned column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Return&nbsp;Date</label>
                      <label className="switch">
                        <input
                          name="toggle_return_date"
                          type="checkbox"
                          checked={this.state.col_return_date_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_return_date_visible: !this.state.col_return_date_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Leave type column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Type</label>
                      <label className="switch">
                        <input
                          name="toggle_type"
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
                    <CustomButton onClick={this.openModal} success>New Leave Application</CustomButton>
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

            {/* List of LeaveApplications */}
            {leaveApplications.length === 0 ? (
              <Message danger text='No leave applications were found in the system' style={{marginTop: '145px'}} />
            ) : (
              <div style={{maxHeight: 'auto', marginTop: '20px', marginLeft: '-40px', backgroundColor: '#eeeeee'}}>
                <BootstrapTable
                  id='tblLeaveApplications'
                  key='tblLeaveApplications'
                  data={leaveApplications}
                  striped
                  hover
                  insertRow={false}
                  // selectRow={(row)=>alert(row)}
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
                  > Leave&nbsp;App&nbsp;ID
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
                  > Leave&nbsp;App&nbsp;Number
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='name'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_employee_visible}
                    customEditor={{
                      getElement: (func, props) =>
                        <ComboBox items={this.props.employees} selected_item={props.row.contact} label='name' />
                    }}
                  > Employee
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='type'
                    dataSort
                    caretRender={this.getCaret}
                    // editable={{type: 'select'}}
                    customEditor={{
                      getElement: (func, props) =>
                        (<ComboBox
                          // selected_item={{option_name: 'ANNUAL'}}
                          label='option_name'
                          items={
                            [
                              {option_name: 'ANNUAL'},
                              {option_name: 'SICK'},
                              {option_name: 'UNPAID'},
                              {option_name: 'FAMILY RESPONSIBILITY - See BCEA for definition'}
                            ]}
                          onChange={(new_val)=>
                          {
                              const selected_type = JSON.parse(new_val);
                              
                              const leave_application = this.state.new_leave_application;
                              leave_application.type = selected_type.option_name;
    
                              this.setState({new_leave_application: leave_application});
                            }}
                        />)
                    }}
                    // thStyle={{position: 'fixed', left: this.state.col_id_end + 240 + 'px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_type_visible}
                  > Type
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='date_started'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_start_date_visible}
                  > Start&nbsp;date
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='date_ended'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_end_date_visible}
                  > End&nbsp;date
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='date_returned'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_return_date_visible}
                  > Date&nbsp;Returned
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
LeaveApplications.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  leaveApplications: PropTypes.arrayOf(PropTypes.object).isRequired,
   t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
  employees: getEmployees(state),
  leaveApplications: getLeaveApplications(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(LeaveApplications);
