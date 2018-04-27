// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
const openDialog = require('../../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;
import { translate } from 'react-i18next';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
// import Select from 'react-select';
import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';

// Actions
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';
import * as JobActions from '../../actions/operations/jobs';

// Global constants
import * as GlobalConstants from  '../../constants/globals';

// Selectors
import { getEmployees } from '../../reducers/HR/EmployeesReducer';
import { getMaterials } from '../../reducers/Operations/MaterialsReducer';
import { getClients } from '../../reducers/Operations/ClientsReducer';
import { getJobs } from '../../reducers/Operations/JobsReducer';

// Components
import ComboBox from '../../components/shared/ComboBox';

// Animation
import Transition from 'react-motion-ui-pack'

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

// Helpers
import * as SessionManager from '../../helpers/SessionManager';
import Log from '../../helpers/Logger';

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

export class Jobs extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.editJob = this.editJob.bind(this);
    this.deleteJob = this.deleteJob.bind(this);
    this.duplicateJob = this.duplicateJob.bind(this);
    this.setJobStatus = this.setJobStatus.bind(this);
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
                    is_new_job_modal_open: false,
                    is_job_tasks_modal_open: false,
                    selected_job: null,
                    active_row: null,
                    column_toggles_top: -200,
                    info: {x: 200, y: 200, display: 'none'},
                    // Table Column Toggles
                    col_id_visible: false,
                    col_object_number_visible: true,
                    col_client_id_visible: true,
                    col_contact_person_id_visible: false,
                    col_sitename_visible: false,
                    col_request_visible: true,
                    col_vat_visible: false,
                    col_revision_visible: false,
                    col_status_visible: true,
                    col_creator_visible: false,
                    col_date_logged_visible: false,
                    // Job to be created
                    new_job:
                    {
                      client_id: null,
                      contact_id: null,
                      request: null,
                      sitename: null,
                      notes: null,
                      vat: GlobalConstants.VAT
                    },
                    // Job Task to be added
                    new_job_task:
                    {
                      job_id: null,
                      location: '',
                      description: '',
                      assignees: [],
                      assignee_names: [],
                      date_scheduled: new Date().getTime(),
                      scheduled_date: new Date()
                    },
                    // TODO: Job Task Item to be added
                    new_task_item: {
                      task_id: null,
                      resource_id: null,
                      unit_cost: 0,
                      quantity: 1,
                      markup: 0,
                      additional_costs: ''
                    }
    };
  }

  // Load Jobs & add event listeners
  componentDidMount()
  {
    this.props.dispatch(JobActions.getJobs());

    // mapStateToProps(this.state);
    // Add Event Listener
    ipc.on('confirmed-delete-job', (event, index, jobId) =>
    {
      if (index === 0)
      {
        this.confirmedDeleteJob(jobId);
      }
    });
  }

  showJobcardPreview(job)
  {
    // Preview Window
    ipc.send('preview-job-card', job);
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount()
  {
    ipc.removeAllListeners('confirmed-delete-job');
  }

  // Open Confirm Dialog
  deleteJob(jobId)
  {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteJob:title'),
        message: t('dialog:deleteJob:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-job',
      jobId
    );
  }

  // Confirm Delete an job
  confirmedDeleteJob(jobId)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.deleteJob(jobId));
  }

  // set the job status
  setJobStatus(jobId, status)
  {
    alert('set status to: ' + status);
    const { dispatch } = this.props;
    // dispatch(Actions.setJobStatus(jobId, status));
  }

  editJob(job)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.editJob(job));
  }

  duplicateJob(job)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.duplicateJob(job));
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
        // jobs.filter(q => q.id < 3).map(p => p.id)
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

    const taskCellEditProp = {
      mode: 'click',
        // if product id less than 3, will cause the whole row noneditable
        // this function should return an array of row keys
        // jobs.filter(q => q.id < 3).map(p => p.id)
      nonEditableRows: () => ['_id', 'object_number', 'job_id', 'description'],
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
    };

    const new_job_task_form = (
      <div>
        {/* form for adding a new Task to Job */}
        <div style={{backgroundColor: 'rgba(255,255,255,.6)', borderRadius: '4px', marginTop: '20px'}}>
          <h3 style={{textAlign: 'center', 'fontWeight': 'lighter'}}>Add new task to job #{row.object_number}</h3>
          <div className="row">
            <div className="pageItem col-md-6">
              <label className="itemLabel">Task description</label>
              <input
                id="description"
                ref={(description)=>this.description=description}
                name="description"
                type="text"
                value={this.state.new_job_task.description}
                onChange={(new_val)=>
                  {
                    const job_task = this.state.new_job_task;
                    
                    job_task.description = new_val.currentTarget.value;
                    this.setState({new_job_task: job_task});
                  }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>

            <div className="pageItem col-md-6">
              <label className="itemLabel">Location</label>
              <input
                id="location"
                ref={(location)=>this.unit_cost=location}
                name="location"
                type="text"
                value={this.state.new_job_task.location}
                onChange={(new_val)=> {
                    const job_task = this.state.new_job_task;
                    
                    job_task.location = new_val.currentTarget.value;
                    this.setState({new_job_task: job_task});
                  }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>
          </div>

          <div className="row">
            <div className="pageItem col-md-6">
              <label className="itemLabel">Date Scheduled</label>
              <input
                name="date_scheduled"
                type="date"
                ref={(date_started)=>this.date_started=date_started}
                value={this.state.new_job_task.scheduled_date.getFullYear() + '-' 
                  + ((this.state.new_job_task.scheduled_date.getMonth()+1) >= 10 ? this.state.new_job_task.scheduled_date.getMonth() + 1 : '0' + (this.state.new_job_task.scheduled_date.getMonth() + 1)) + '-'
                  + (this.state.new_job_task.scheduled_date.getDate() >= 10 ? this.state.new_job_task.scheduled_date.getDate() : '0' + this.state.new_job_task.scheduled_date.getDate())}
                onChange={(new_val)=> {
                    console.log(new_val.currentTarget.value);
                    const job_task = this.state.new_job_task;
                    
                    job_task.scheduled_date = new Date(new_val.currentTarget.value);
                    job_task.date_scheduled = job_task.scheduled_date.getTime()/1000;
                    this.setState({new_job_task: job_task});
                  }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>

            <div className="pageItem col-md-6">
              {/* <label className="itemLabel">Unit</label> */}
              {/* <input
                name="unit"
                type="text"
                disabled
                value={this.state.new_job_task.unit}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              /> */}
            </div>
          </div>
          <div style={{width: '300px', marginLeft: 'auto', marginRight: 'auto', marginTop: '15px'}}>
            <CustomButton
              success
              style={{width: '120px', height: '50px', float: 'left'}}
              onClick={() =>
                  {
                    if(this.state.new_job_task.description && this.state.new_job_task.location)
                    {
                      this.state.new_job_task.job_id = row._id;
                      this.state.new_job_task.object_number = row.tasks.length;
                      this.state.new_job_task.date_logged = new Date().getTime()/1000; // epoch sec
                      this.state.new_job_task.creator = SessionManager.session_usr.usr;
                      this.state.new_job_task.creator_name = SessionManager.session_usr.name;
                      // update state
                      this.setState(this.state.new_job_task);
                      console.log('new task to be created: ', this.state.new_job_task);
                      // push to array of job tasks
                      row.tasks.push(this.state.new_job_task);

                      // signal add job item
                      this.props.dispatch({
                        type: ACTION_TYPES.JOB_TASK_ADD,
                        payload: this.state.new_job_task
                      });

                      // TODO: fix this hack
                      // signal update job - so it saves to local storage
                      this.props.dispatch({
                        type: ACTION_TYPES.JOB_UPDATE,
                        payload: row
                      });
                    } else
                      openDialog(
                        {
                          type: 'warning',
                          title: 'Could not add task to job',
                          message: 'Please make sure that the description, location and scheduled date are valid.'
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

    const job_options_form = (
      <div>
        <CustomButton primary onClick={() => this.showJobcardPreview(row)}>PDF Preview</CustomButton>
        {/* onClick={() => this.showQuotePreview(row)} */}
        <CustomButton
          primary
          style={{marginLeft: '15px'}}
          onClick={(evt) =>
          {
            // if(!row.status == 0)
            // {
            //   return this.props.dispatch({
            //     type: ACTION_TYPES.UI_NOTIFICATION_NEW,
            //     payload: {
            //       type: 'danger',
            //       message: 'Error: Quote has not yet been approved',
            //     },
            //   });
            // }

            // Prepare Invoice
            const new_invoice =
            {
              // object_number = this.props.invoices.length,
              job_id: row._id,
              job: row,
              receivable: 0,
              client_name: row.client_name,
              client: row.client,
              contact_person: row.contact_person,
              request: row.request,
              sitename: row.sitename,
              vat: row.vat,
              creator_name: SessionManager.session_usr.name,
              status: 0,
              creator: SessionManager.session_usr.usr,
              creator_employee: SessionManager.session_usr,
              date_logged: new Date().getTime()/1000 // current date in epoch SECONDS
            }

            // this.props.invoices.push(new_job);

            // ipc.send(evt, 'change-operations-tab', 3);

            // dispatch action to create job on local & remote stores
            this.props.dispatch({
              type: ACTION_TYPES.INVOICE_NEW,
              payload: new_invoice
            });

            // this.props.changeTab(2);
          }}
        >Create&nbsp;New&nbsp;Invoice
        </CustomButton>

        {/* form for editing Job properties */}
        <div style={{backgroundColor: 'rgba(255,255,255,.6)', borderRadius: '4px', marginTop: '10px'}}>
          <h3 style={{textAlign: 'center', 'fontWeight': 'lighter'}}>Job #{row.object_number} Properties</h3>
          <div className="row">
            <div className="pageItem col-md-6">
              <label className="itemLabel">Date&nbsp;Started</label>
              <input
                type='date'
                id="date_started"
                name="date_started"
                ref={(date_started)=>this.date_started=date_started}
                defaultValue={row.start_date}
                onChange={(new_val)=>
                {
                  console.log('new job start date in epoch millis: ', new Date(new_val.currentTarget.value).getTime());

                  this.props.dispatch({
                    type: ACTION_TYPES.JOB_UPDATE,
                    payload: Object.assign(row, {date_started: new Date(new_val.currentTarget.value).getTime()/1000, start_date : new_val.currentTarget.value})
                  });
                  // row.date_started = new Date(new_val.currentTarget.value).getTime();
                  // console.log(new_val.currentTarget.value);

                //     const job_task = this.state.new_job_task;
                    
                //     job_task.unit_cost = new_val.currentTarget.value;
                //     this.setState({new_job_task: job_task});
                }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>

            <div className="pageItem col-md-6">
              <label className="itemLabel">Date&nbsp;Completed</label>
              <input
                type='date'
                id="date_completed"
                name="date_completed"
                ref={(date_completed)=>this.date_completed=date_completed}
                defaultValue={row.end_date}
                onChange={(new_val)=> {
                  console.log('new job end date in epoch millis: ', new Date(new_val.currentTarget.value).getTime());

                  this.props.dispatch({
                    type: ACTION_TYPES.JOB_UPDATE,
                    payload: Object.assign(row, {date_completed: new Date(new_val.currentTarget.value).getTime()/1000, end_date : new_val.currentTarget.value})
                  });
                }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>
          </div>

          <div className="row">
            <div className="pageItem col-md-6">
              <label className="itemLabel">Scheduled&nbsp;Date</label>
              <input
                type='date'
                id="date_scheduled"
                name="date_scheduled"
                ref={(date_scheduled)=>this.date_scheduled=date_scheduled}
                defaultValue={row.scheduled_date}
                onChange={(new_val)=> {
                  console.log('new job scheduled date in epoch millis: ', new Date(new_val.currentTarget.value).getTime());

                  this.props.dispatch({
                    type: ACTION_TYPES.JOB_UPDATE,
                    payload: Object.assign(row, {planned_start_date: new Date(new_val.currentTarget.value).getTime()/1000, scheduled_date : new_val.currentTarget.value})
                  });
                }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>

            <div className="pageItem col-md-6">
              {/* <label className="itemLabel">Job Status</label>
              <input
                name="status"
                type="text"
                // disabled
                // value={this.state.new_job_task.unit}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              /> */}
            </div>
          </div>
        </div> 
      </div>
    );

    return  (
      row.tasks.length === 0 ? (
        <div>
          { /* Job options */ }
          { job_options_form }
          <Message danger text='Job has no tasks.' style={{marginTop: '20px'}} />
          { /* form for adding a new JobItem */ }
          { new_job_task_form }
        </div>
      ) :
        <div style={{maxHeight: 'auto'}}>
          { /* Job options */ }
          {job_options_form}
          <h3 style={{textAlign: 'center', 'fontWeight': 'lighter', marginTop: '15px'}}>List of tasks for job #{row.object_number}</h3>
          <BootstrapTable
            id='tblJobTasks'
            data={row.tasks}
            striped
            hover
            insertRow={false}
            cellEdit={taskCellEditProp}
            // options={options}
            // onScroll={}
            version='4' // bootstrap version
          >
            {/* <TableHeaderColumn
              isKey
              dataField='_id'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_object_number_visible}
              hidden
            > Task&nbsp;ID
            </TableHeaderColumn> */}

            <TableHeaderColumn
              isKey
              dataField='object_number'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_object_number_visible}
            > Task&nbsp;Number
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='description'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_object_number_visible}
            > Task&nbsp;Description
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='date_scheduled'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_client_id_visible}
            > Date&nbsp;Scheduled
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='assignee_names'
              // dataSort
              // caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              customEditor={{
                getElement: (func, props) =>
                  (
                    <div style={{backgroundColor: 'rgba(0,0,0,.3)', borderRadius: '4px', border: '2px solid #5BA5E8'}}>
                      <ComboBox
                        items={this.props.employees}
                        label='name'
                        value={this.props.employees.length > 0 ? this.props.employees[0]: null}
                        selected_item={this.props.employees.length > 0 ? this.props.employees[0]: null}
                        onUpdate={(new_val)=>
                        {
                          const assignee_names = props.row.assignee_names;
                          const assignees = props.row.assignees;

                          const selected_user = JSON.parse(new_val);

                          assignee_names.push(selected_user.name);
                          assignees.push(selected_user);

                          const assignee_html = 
                            '<p style="background-color: rgba(255,255,255,.2);line-height: 45px; border-radius: 15px; border: 1px solid #fff; margin-top: 5px;">'
                              + selected_user.name
                              + '<span class="ion-close-circled" onmouseover="this.style.color=\'red\';this.style.cursor=\'pointer\'" onmouseout="this.style.color=\'#fff\'" style="float:right;width: 20px;height: 20px;color: #fff;"></span>'
                            + '</p>';
                          if(assignees.length>1)
                            this.assignee_container.innerHTML += assignee_html;// existing items, append
                          else this.assignee_container.innerHTML = assignee_html; // no items, add first item

                          Object.assign(props.row.assignee_names, assignee_names);
                          Object.assign(props.row.assignees, assignees);
                        }}
                      />
                      {/* Show list of current assignees with delete button */}
                      <div ref={(r)=> this.assignee_container =r}>
                        {
                          props.row.assignees.length > 0 ? 
                            props.row.assignees.map(assignee=>
                              //  (<p>{assignee.name}</p>)
                              (
                                <p
                                  style={{
                                    background: 'rgba(255,255,255,.2)',
                                    lineHeight: '45px',
                                    borderRadius: '15px',
                                    border: '1px solid #fff',
                                    marginTop: '5px'}}
                                >
                                  {assignee.name}
                                  <span
                                    id={props.row.assignees.length}
                                    index={props.row.assignees.length}
                                    key={props.row.assignees.length}
                                    ref={(obj)=>this.assignee= obj}
                                    className="ion-close-circled"
                                    // onMouseOver='this.style.color="red"; this.style.cursor="pointer"'
                                    onMouseOver={(el)=>Object.assign(el.target.style, {color: 'red'})}
                                    onMouseOut={(el)=>Object.assign(el.target.style, {color: '#fff'})}
                                    onFocus={(el)=>Object.assign(el.target.style, {border: 'lime'})}
                                    onBlur={(el)=>Object.assign(el.target.style, {border: 'none'})}
                                    style={{float: 'right', width: '40px', height: '40px'}}
                                  />
                                </p>)
                            ) : (<p>No Assignees, pick from list</p>)
                        }
                      </div>
                    </div>)
              }}
              // hidden={!this.state.col_contact_person_id_visible}
            > Assignees
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
          { /* form for adding a new Task to Job */ }
          {new_job_task_form}
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
    this.setState({ is_new_job_modal_open: true });
  }
 
  afterOpenModal()
  {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#2FA7FF';
  }
 
  closeModal()
  {
    this.setState({is_new_job_modal_open: false});
  }

  // Render
  render()
  {
    const { jobs, t } = this.props;

    const cellEditProp =
    {
      mode: 'click',
        // if product id less than 3, will cause the whole row noneditable
        // this function should return an array of row keys
        // jobs.filter(q => q.id < 3).map(p => p.id)
      nonEditableRows: () => ['_id', 'object_number', 'date_logged', 'creator', 'creator_name', 'client', 'request', 'job_revisions', 'contact_person'],
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

    // const clientFormatter = (cell, row) => (<div>test</div>);
    const clientFormatter = (cell, row) => `<i class='glyphicon glyphicon-${cell.client_name}'></i> ${cell.client_name}`;

    const info = (
      <div style={{position: 'fixed', display: this.state.info.display, top: this.state.info.y, left: this.state.info.x, background:'rgba(0,0,0,.8)', borderRadius: '4px', boxShadow: '0px 0px 10px #343434', border: '1px solid #000', zIndex: '300'}}>
        <p style={{color: '#fff', marginTop: '5px'}}>&nbsp;click&nbsp;to&nbsp;sort&nbsp;by&nbsp;this&nbsp;column&nbsp;</p>
      </div>);

    const no_jobs_msg = (
      <Message danger text='No jobs were found in the system' style={{marginTop: '145px'}} />
    );
    return (
      <PageContent bare>
        <div style={{maxHeight: 'auto'}}>
          {info}
          {/* Job Creation Modal */}
          <Modal
            isOpen={this.state.is_new_job_modal_open}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={modalStyle}
            contentLabel="New Job Modal"
          >
            <h2 ref={subtitle => this.subtitle = subtitle} style={{color: 'black'}}>Create New Job</h2>
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
                      // selected_item={this.state.new_job.contact}
                      label='name'
                      onUpdate={(new_val)=>{
                        const selected_contact = JSON.parse(new_val);
                        const job = this.state.new_job;
                        job.contact_id = selected_contact.usr;

                        this.setState({new_job: job});
                      }}
                    />
                  </div>
                </div>

                <div className="pageItem col-md-6">
                  <label className="itemLabel">{t('common:fields:company')}</label>
                  <div>
                    <ComboBox
                      ref={(cbx_clients)=>this.cbx_clients = cbx_clients}
                      items={this.props.clients}
                      // selected_item={this.state.new_job.client}
                      label='client_name'
                      onUpdate={(new_val)=>{
                        const selected_client = JSON.parse(new_val);
                        const job = this.state.new_job;
                        job.client_id = selected_client._id;
                        this.setState({new_job: job});
                        this.sitename = selected_client.physical_address;
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="pageItem col-md-6">
                  <label className="itemLabel">Sitename</label>
                  <input
                    ref={(txt_sitename)=>this.txt_sitename = txt_sitename}
                    name="sitename"
                    type="text"
                    // value={this.state.new_job.sitename}
                    onChange={(new_val)=>{
                      const job = this.state.new_job;
                      job.sitename = new_val.currentTarget.value;
                      this.setState({new_job: job});
                    }}
                    style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>

                <div className="pageItem col-md-6">
                  <label className="itemLabel">Request</label>
                  <input
                    name="request"
                    type="text"
                    // value={this.state.new_job.request}
                    onChange={(new_val)=>{
                      const job = this.state.new_job;
                      job.request = new_val.currentTarget.value;
                      this.setState({new_job: job});
                    }}
                    style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>

              <div className="row">
                <div className="pageItem col-md-6">
                  <label className="itemLabel">VAT [{this.state.new_job.vat} %]</label>
                  <label className="switch">
                    <input
                      name="vat"
                      type="checkbox"
                      checked={this.state.new_job.vat>0}
                      onChange={() =>
                        {
                          const job = this.state.new_job;
                          job.vat = job.vat > 0 ? 0 : GlobalConstants.VAT;
                          this.setState(
                          {
                            new_job: job
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
                    value={this.state.new_job.other}
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
                  console.log(this.state.new_job);
                  this.props.jobs.push(this.state.new_job);
                }}
                style={{width: '120px', height: '50px', float: 'left'}}
                success
              >Create
              </CustomButton>
            </div>
          </Modal>

          {/* Jobs table & Column toggles */}
          <div style={{paddingTop: '0px'}}>
            
            <Transition
              component={false}
              enter={{
                // top: 80,
                translateY: this.state.column_toggles_top
              }}
              leave={{
                // top: -70,
                translateY: this.state.column_toggles_top
              }}
              ref={(el)=> this.col_toggles_container = el}
              style={{
                zIndex: '10',
                background: 'rgb(180, 180, 180)',
                // top: this.state.column_toggles_top + 'px',
                left: window.innerWidth * 0.010 + '%',
              }}
            >
              {/* Jobs Table column toggles */}
              {/* ref={(el)=> this.col_toggles_container = el} style={{position: 'fixed',background: 'rgb(180, 180, 180)', top: '-70px', left: window.innerWidth * 0.010 + '%', boxShadow: '0px 10px 35px #343434'}} */}
              <div key='jobs_col_toggles' style={{position: 'fixed', top: '130px', width: '1175px', boxShadow: '0px 10px 35px #343434', zIndex: '20'}}>
                <h2 style={{textAlign: 'center', fontWeight: 'lighter'}}>Show/Hide Table Columns</h2>
                <Part>
                  <Row>
                    {/* ID column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Job&nbsp;ID</label>
                      <label className="switch">
                        <input
                          name="jobID"
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
                      <label className="itemLabel">Job&nbsp;No.</label>
                      <label className="switch">
                        <input
                          name="jobNumber"
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

                    {/* Client column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Client</label>
                      <label className="switch">
                        <input
                          name="clientID"
                          type="checkbox"
                          checked={this.state.col_client_id_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_client_id_visible: !this.state.col_client_id_visible
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
                          name="contactID"
                          type="checkbox"
                          checked={this.state.col_contact_person_id_visible}
                          onChange={() => {
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

                    {/* Sitename column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Sitename</label>
                      <label className="switch">
                        <input
                          name="sitename"
                          type="checkbox"
                          checked={this.state.col_sitename_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_sitename_visible: !this.state.col_sitename_visible
                            });
                            this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Request column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Request</label>
                      <label className="switch">
                        <input
                          name="request"
                          type="checkbox"
                          checked={this.state.col_request_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_request_visible: !this.state.col_request_visible
                            });
                            this.toggleColumnVisibility();
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
                          name="vat"
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

                    {/* Revision column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Revision</label>
                      <label className="switch">
                        <input
                          name="revision"
                          type="checkbox"
                          checked={this.state.col_revision_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_revision_visible: !this.state.col_revision_visible
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
                    <CustomButton onClick={this.openModal} success>Create New Job</CustomButton>
                    <CustomButton
                      success
                      style={{marginLeft: '20px'}}
                      onClick={() => 
                      {
                        // if(this.col_toggles_container.style.top.includes('-'))
                        //   this.col_toggles_container.style.top = '100px';
                        // else this.col_toggles_container.style.top = '-70px';
                        if(this.state.column_toggles_top < -80)
                          // this.col_toggles_container.style.top = '80px';
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

            {/* List of Jobs */}
            { 
              jobs.length === 0 ? (
                (no_jobs_msg)
              ) : (
                // , marginLeft: '-40px'
                <div style={{maxHeight: 'auto', marginTop: '20px', backgroundColor: '#2BE8A2'}}>
                  <BootstrapTable
                    id='tblJobs'
                    data={jobs}
                    striped
                    hover
                    insertRow={false}
                    selectRow={{bgColor: 'lime'}}
                    expandableRow={this.isExpandableRow}
                    expandComponent={this.expandComponent}
                    trStyle={(row) => ({background: 'lightblue'})}
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
                      isKey
                      dataField='_id'
                      dataSort
                      caretRender={this.getCaret}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_id_visible}
                    > Job ID
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField='object_number'
                      dataSort
                      caretRender={this.getCaret}
                      editable={false}
                      tdStyle={() => {({'fontWeight': 'lighter'})}}
                      hidden={!this.state.col_object_number_visible}
                    > Job Number
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField='client_name'
                      dataSort
                      caretRender={this.getCaret}
                      editable={false}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_client_id_visible}
                    > Client
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField='contact_person'
                      dataSort
                      editable={false}
                      caretRender={this.getCaret}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_contact_person_id_visible}
                    > Contact Person
                    </TableHeaderColumn>
                    
                    <TableHeaderColumn
                      dataField='sitename'
                      dataSort
                      editable={false}
                      caretRender={this.getCaret}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_sitename_visible}
                    > Sitename
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField='request'
                      dataSort
                      editable={false}
                      caretRender={this.getCaret}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_request_visible}
                    >Request
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField='vat'
                      dataSort
                      caretRender={this.getCaret}
                      editable={false}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_vat_visible}
                    > VAT
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField='job_revisions'
                      dataSort
                      caretRender={this.getCaret}
                      editable={false}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_revision_visible}
                    > Quote Revisions
                    </TableHeaderColumn>
                    
                    <TableHeaderColumn
                      dataField='status'
                      dataSort
                      caretRender={this.getCaret}
                      editable={false}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_status_visible}
                    > Status
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField='creator_name'
                      dataSort
                      ref={this.creator_ref}
                      caretRender={this.getCaret}
                      editable={false}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_creator_visible}
                    > Creator
                    </TableHeaderColumn>

                    <TableHeaderColumn
                      dataField='date_logged'
                      dataSort
                      caretRender={this.getCaret}
                      editable={false}
                      tdStyle={{'fontWeight': 'lighter'}}
                      hidden={!this.state.col_date_logged_visible}
                    > Date Logged
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
Jobs.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  materials: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  jobs: PropTypes.arrayOf(PropTypes.object).isRequired,
   t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
  employees: getEmployees(state),
  jobs: getJobs(state),
  clients: getClients(state),
  materials: getMaterials(state)
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Jobs);
