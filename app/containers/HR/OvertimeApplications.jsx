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
import sessionManager from '../../helpers/SessionManager';
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
import { getJobs } from '../../reducers/Operations/JobsReducer';
import { getOvertimeApplications } from '../../reducers/HR/OvertimeApplicationsReducer';

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

export class OvertimeApplications extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.editOvertime = this.editOvertime.bind(this);
    this.deleteOvertime = this.deleteOvertime.bind(this);
    this.duplicateOvertime = this.duplicateOvertime.bind(this);
    this.setOvertimeStatus = this.setOvertimeStatus.bind(this);
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
                    is_new_overtime_modal_open: false,
                    selected_overtime: null,
                    active_row: null,
                    column_toggles_top: -200,
                    
                    // Table Column Toggles
                    col_id_visible: false,
                    col_object_number_visible: true,
                    col_employee_visible: false,
                    col_date_visible: true,
                    col_time_in_visible: true,
                    col_time_out_visible: false,
                    col_job_visible: true,
                    col_status_visible: true,
                    col_creator_visible: false,
                    col_date_logged_visible: false,

                    new_overtime_application:
                    {
                      usr: null,
                      type: null,
                      date: new Date().getTime(),
                      overtime_date: new Date(),
                      time_in: new Date().getTime(),
                      in_time: formatDate(new Date()),
                      time_out: new Date().getTime(),
                      out_time: formatDate(new Date()),
                      status: 0,
                      status_description: 'Pending'
                    }
    };
  }

  // Load OvertimeApplications & add event listeners
  componentDidMount()
  {
    // Add Event Listener
    ipc.on('confirmed-delete-overtime', (event, index, overtimeId) =>
    {
      if (index === 0)
      {
        this.confirmedDeleteOvertime(overtimeId);
      }
    });
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount()
  {
    ipc.removeAllListeners('confirmed-delete-overtime');
  }

  // Open Confirm Dialog
  deleteOvertime(overtimeId)
  {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteOvertime:title'),
        message: t('dialog:deleteOvertime:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-overtime',
      overtimeId
    );
  }

  // Confirm Delete an overtime
  confirmedDeleteOvertime(overtimeId)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.deleteOvertime(overtimeId));
  }

  // set the overtime status
  setOvertimeStatus(overtimeId, status)
  {
    alert('set status to: ' + status);
    const { dispatch } = this.props;
    // dispatch(Actions.setOvertimeStatus(overtimeId, status));
  }

  editOvertime(overtime)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.editOvertime(overtime));
  }

  duplicateOvertime(overtime)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.duplicateOvertime(overtime));
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
    this.setState({ is_new_overtime_modal_open: true });
  }
 
  afterOpenModal()
  {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#2FA7FF';
  }
 
  closeModal()
  {
    this.setState({is_new_overtime_modal_open: false});
  }

  // Render
  render()
  {
    const { overtimeApplications, t } = this.props;
    
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
          {/* OvertimeApplication Creation Modal */}
          <Modal
            isOpen={this.state.is_new_overtime_modal_open}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={modalStyle}
            contentLabel="New OvertimeApplication Modal"
          >
            <h2 ref={subtitle => this.subtitle = subtitle} style={{color: 'black'}}>New overtime application</h2>
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
                  <label className="itemLabel">Overtime Job</label>
                  <div>
                    <ComboBox
                      ref={(cbx_overtime_job)=>this.cbx_overtime_job = cbx_overtime_job}
                      items={this.props.jobs}
                        // selected_item={this.state.new_overtime_application.client}
                      label='object_number'
                      onChange={(new_val)=>{
                          const selected_job = JSON.parse(new_val.currentTarget.value);
                          
                          const overtime_application = this.state.new_overtime_application;
                          overtime_application.job = selected_job;
                          overtime_application.job_id = selected_job._id;

                          this.setState({new_overtime_application: overtime_application});
                        }}
                    />
                  </div>
                </div>
                {/* this.state.new_job_task.scheduled_date.getFullYear() + '-' 
                      + ((this.state.new_job_task.scheduled_date.getMonth()+1) >= 10 ? this.state.new_job_task.scheduled_date.getMonth() + 1 : '0' + (this.state.new_job_task.scheduled_date.getMonth() + 1)) + '-'
                      + (this.state.new_job_task.scheduled_date.getDate() >= 10 ? this.state.new_job_task.scheduled_date.getDate() : '0' + this.state.new_job_task.scheduled_date.getDate()) */}
                <div className="pageItem col-md-6">
                  <label className="itemLabel"> Date </label>
                  <input
                    name="date"
                    type="date"
                    ref={(date)=>this.date=date}
                    defaultValue={formatDate(new Date())}
                    onChange={(new_val)=>
                    {
                      const overtime_application = this.state.new_overtime_application;
                      
                      overtime_application.overtime_date = formatDate(new Date(new_val.currentTarget.value));
                      overtime_application.date = new Date(new_val.currentTarget.value).getTime();
                      
                      this.setState({new_overtime_application: overtime_application});
                    }}
                    style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>

              <div className="row">
                <div className="pageItem col-md-6">
                  <label className="itemLabel">Time In</label>
                  <input
                    name="time_in"
                    type="date"
                    ref={(time_in)=>this.time_in=time_in}
                    defaultValue={formatDate(new Date())}
                    onChange={(new_val)=>
                    {
                      const overtime_application = this.state.new_overtime_application;
                      
                      overtime_application.in_time = formatDate(new Date(new_val.currentTarget.value));
                      overtime_application.time_in = new Date(new_val.currentTarget.value).getTime();
                      
                      this.setState({new_overtime_application: overtime_application});
                    }}
                    style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>

                <div className="pageItem col-md-6">
                  <label className="itemLabel">Time Out</label>
                  <input
                    name="time_out"
                    type="date"
                    ref={(time_out)=>this.time_out=time_out}
                    defaultValue={formatDate(new Date())}
                    onChange={(new_val)=>
                    {
                      const overtime_application = this.state.new_overtime_application;
                      
                      overtime_application.out_time = formatDate(new Date(new_val.currentTarget.value));
                      overtime_application.time_out = new Date(new_val.currentTarget.value).getTime();
                      
                      this.setState({new_overtime_application: overtime_application});
                    }}
                    style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
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
                  const overtime_application = this.state.new_overtime_application;

                  if(!overtime_application.job)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid overtime type',
                      },
                    });
                  }

                  if(!overtime_application.date)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid start date',
                      },
                    });
                  }

                  if(!overtime_application.time_in)
                  {
                    return this.props.dispatch({
                            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                            payload: {
                              type: 'danger',
                              message: 'Invalid end date',
                            },
                          });
                  }
                  
                  if(overtime_application.date > overtime_application.time_in)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Error: Invalid start & end dates. Start date has to be before end date',
                      },
                    });
                  }

                  // Prepare Overtime Application
                  overtime_application.usr = sessionManager.getSessionUser().usr;
                  overtime_application.creator_name = sessionManager.getSessionUser().name;
                  overtime_application.creator = sessionManager.getSessionUser().usr;
                  overtime_application.creator_employee = sessionManager.getSessionUser();
                  overtime_application.date_logged = new Date().getTime();// current date in epoch ms
                  overtime_application.logged_date = formatDate(new Date()); // current date

                  this.setState({new_overtime_application: overtime_application, is_new_overtime_modal_open: false});

                  this.props.overtimeApplications.push(this.state.new_overtime_application);
                  mapStateToProps(this.state);

                  // this.props.dispatch({
                  //   type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                  //   payload: {
                  //     type: 'success',
                  //     message: 'Successfully created new overtime_application',
                  //   },
                  // });

                  // dispatch action to create overtime_application on local & remote stores
                  this.props.dispatch({
                    type: ACTION_TYPES.OVERTIME_NEW,
                    payload: this.state.new_overtime_application
                  });
                  
                }}
                style={{width: '120px', height: '50px', float: 'left'}}
                success
              >Create
              </CustomButton>
            </div>
          </Modal>
          {/* OvertimeApplications table & Column toggles */}
          <div style={{paddingTop: '0px'}}>
            {/* OvertimeApplications Table column toggles */}
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
              <div ref={(r)=>this.toggle_container = r} key='overtime_applications_col_toggles' style={{boxShadow: '0px 10px 35px #343434', marginLeft: '-35px', position: 'fixed', top:  '130px'}}>
                <h2 style={{textAlign: 'center', fontWeight: 'lighter'}}>Show/Hide Table Columns</h2>
                <Part>
                  <Row>
                    {/* ID column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Overtime&nbsp;App&nbsp;ID</label>
                      <label className="switch">
                        <input
                          name="toggle_overtime_id"
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
                      <label className="itemLabel">Overtime&nbsp;App&nbsp;No.</label>
                      <label className="switch">
                        <input
                          name="toggle_overtime_number"
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
                          name="toggle_date"
                          type="checkbox"
                          checked={this.state.col_date_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_date_visible: !this.state.col_date_visible
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
                          name="toggle_time_in"
                          type="checkbox"
                          checked={this.state.col_time_in_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_time_in_visible: !this.state.col_time_in_visible
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
                          name="toggle_time_out"
                          type="checkbox"
                          checked={this.state.col_time_out_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_time_out_visible: !this.state.col_time_out_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Overtime type column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Job #</label>
                      <label className="switch">
                        <input
                          name="toggle_type"
                          type="checkbox"
                          checked={this.state.col_job_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_job_visible: !this.state.col_job_visible
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
                    <CustomButton onClick={this.openModal} success>New Overtime Application</CustomButton>
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

            {/* List of OvertimeApplications */}
            {overtimeApplications.length === 0 ? (
              <Message danger text='No overtime applications were found in the system' style={{marginTop: '145px'}} />
            ) : (
              <div style={{maxHeight: 'auto', marginTop: '20px', marginLeft: '-40px', backgroundColor: '#eeeeee'}}>
                <BootstrapTable
                  id='tblOvertimeApplications'
                  key='tblOvertimeApplications'
                  data={overtimeApplications}
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
                  > Overtime&nbsp;App&nbsp;ID
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
                  > Overtime&nbsp;App&nbsp;Number
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
                    dataField='job_id'
                    dataSort
                    caretRender={this.getCaret}
                    // editable={{type: 'select'}}
                    customEditor={{
                      getElement: (func, props) =>
                        (<ComboBox
                          ref={(cbx_overtime_job)=>this.cbx_overtime_job = cbx_overtime_job}
                          items={this.props.jobs}
                            // selected_item={this.state.new_overtime_application.client}
                          label='object_number'
                          onChange={(new_val)=>{
                              const selected_job = JSON.parse(new_val.currentTarget.value);
                              
                              const overtime_application = this.state.new_overtime_application;
                              overtime_application.job = selected_job;
                              overtime_application.job_id = selected_job._id;
    
                              this.setState({new_overtime_application: overtime_application});
                            }}
                        />)
                    }}
                    // thStyle={{position: 'fixed', left: this.state.col_id_end + 240 + 'px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_job_visible}
                  > Type
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='overtime_date'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_date_visible}
                  > Date
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='in_time'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_time_in_visible}
                  > Time&nbsp;In
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='out_time'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_time_out_visible}
                  > Time&nbsp;Out 
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
OvertimeApplications.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
  overtimeApplications: PropTypes.arrayOf(PropTypes.object).isRequired,
   t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
  employees: getEmployees(state),
  jobs: getJobs(state),
  overtimeApplications: getOvertimeApplications(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(OvertimeApplications);
