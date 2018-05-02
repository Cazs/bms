// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const openDialog = require('../../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;

import { translate } from 'react-i18next';

// import Select from 'react-select';
import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';

// Actions
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Animation
import { Motion, spring } from 'react-motion';
import Transition from 'react-motion-ui-pack'

// Global constants
import * as GlobalConstants from  '../../constants/globals';

// Selectors
import { getEmployees } from '../../reducers/HR/EmployeesReducer';
import { getSafetyDocuments } from '../../reducers/Compliance/SafetyDocsReducer';

// Components
import ComboBox from '../../components/shared/ComboBox';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Message from '../../components/shared/Message';
import Button, { ButtonsGroup } from '../../components/shared/Button';
import { Field, Part, Row } from '../../components/shared/Part';
import Logo from '../../components/settings/_partials/profile/Logo';

import Modal from 'react-modal';

// Styles
import styled from 'styled-components';

// Helpers
import * as SessionManager from '../../helpers/SessionManager';
import Log, { formatDate } from '../../helpers/Logger';

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

export class SafetyDocuments extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.editSafetyDocument = this.editSafetyDocument.bind(this);
    this.deleteSafetyDocument = this.deleteSafetyDocument.bind(this);
    this.duplicateSafetyDocument = this.duplicateSafetyDocument.bind(this);
    this.setSafetyDocumentStatus = this.setSafetyDocumentStatus.bind(this);
    this.expandComponent = this.expandComponent.bind(this);
    this.showDocumentPreview = this.showDocumentPreview.bind(this);
    this.getCaret = this.getCaret.bind(this);
    
    // this.creator_ref = React.createRef();
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.col_toggles_container = null;
    this.col_width = 235;
    this.state = {
                    filter: null,
                    is_new_safety_doc_modal_open: false,
                    is_safety_doc_items_modal_open: false,
                    selected_safety_doc: null,
                    active_row: null,
                    column_toggles_top: -200,
                    info: {x: 200, y: 200, message: '', display: 'none'},

                    new_safety_document:
                    {
                      document:
                      {
                        filename: '',
                        content_type: null,
                        file: null,
                        other: null,
                        creator: SessionManager.session_usr.usr,
                        creator_employee: SessionManager.session_usr,
                        date_logged: new Date().getTime(),
                        logged_date: formatDate(new Date())// current date
                      },
                      creator: SessionManager.session_usr.usr,
                      creator_employee: SessionManager.session_usr,
                      date_logged: new Date().getTime(),
                      logged_date: formatDate(new Date())// current date
                    },
                    // Table Column Toggles
                    col_id_visible: false,
                    col_object_number_visible: true,
                    col_doc_title_visible: true,
                    col_doc_type_visible: true,
                    col_doc_desc_visible: false,
                    col_status_visible: true,
                    col_creator_visible: true,
                    col_date_logged_visible: true,
    };
  }

  // Load SafetyDocuments & add event listeners
  componentDidMount()
  {
    // Add Event Listener
    ipc.on('confirmed-delete-safety_doc', (event, index, safety_docId) =>
    {
      if (index === 0)
      {
        this.comfirmedSafetyDocument(safety_docId);
      }
    });
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount()
  {
    ipc.removeAllListeners('confirmed-delete-safety_doc');
  }

  // Open Confirm Dialog
  deleteSafetyDocument(safety_docId)
  {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteSafetyDocument:title'),
        message: t('dialog:deleteSafetyDocument:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-safety_doc',
      safety_docId
    );
  }

  // Confirm Delete an safety_doc
  comfirmedSafetyDocument(safety_docId)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.deleteSafetyDocument(safety_docId));
  }

  // set the safety_doc status
  setSafetyDocumentStatus(safety_docId, status)
  {
    alert('set status to: ' + status);
    const { dispatch } = this.props;
    // dispatch(Actions.setSafetyDocumentStatus(safety_docId, status));
  }

  editSafetyDocument(safety_doc)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.editSafetyDocument(safety_doc));
  }

  duplicateSafetyDocument(safety_doc)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.duplicateSafetyDocument(safety_doc));
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
          onMouseEnter={(evt)=>this.setState({info: Object.assign(this.state.info, { message: 'click to toggle sort order', display: 'block', x: evt.clientX, y: evt.clientY})})}
          onMouseLeave={(evt)=>this.setState({info: Object.assign(this.state.info, { message: '', display: 'none'})})}
        />
      );
    }
    if (direction === 'desc')
    {
      return (
        <img
          src="../static/open-iconic-master/svg/caret-bottom.svg"
          alt='down'
          onMouseEnter={(evt)=>this.setState({info: Object.assign(this.state.info, { message: 'click to toggle sort order', display: 'block', x: evt.clientX, y: evt.clientY})})}
          onMouseLeave={(evt)=>this.setState({info: Object.assign(this.state.info, { message: '', display: 'none'})})}
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
          onMouseEnter={(evt)=>this.setState({info: Object.assign(this.state.info, { message: 'click to toggle sort order', display: 'block', x: evt.clientX, y: evt.clientY})})}
          onMouseLeave={(evt)=>this.setState({info: Object.assign(this.state.info, { message: '', display: 'none'})})}
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

  showDocumentPreview(safety_doc)
  {
    // Preview Window
    ipc.send('preview-document', safety_doc.document);
    // Open the PDF with default Reader
    // shell.openExternal('file://' + pdfPath);
  }

  expandComponent(row)
  {
    return (
      <div>
        <div className='row'>
          <div className="pageItem col-md-6">
            <Button
              primary
              style={{width: '140px', height: '40px'}}
              onClick={() => this.showDocumentPreview(row)}
            >
            PDF&nbsp;Preview
            </Button>
          </div>
          <div className="pageItem col-md-6">
            <p style={{background: 'rgba(255,255,255,.3)', borderRadius: '3px', padding: '3px', float: 'left', textAlign: 'left'}}>
              <i style={{marginLeft: '20px', float: 'left', textAlign: 'left'}}>Update&nbsp;file&nbsp;from&nbsp;[{row.document.filename}]:</i>
              <input
                name="file_path"
                type="file"
                ref={(file_path_upd) => this.file_path_upd = file_path_upd}
                style={{marginLeft: '20px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                onChange={(new_val)=>
                {
                  if(this.file_path_upd.files.length > 0)
                  {
                    const safety_document = row;// this.state.selected_safety_document;

                    console.log('>>>>>> Chosen File: ', this.file_path_upd.files[0]);
                    console.log('>>>>>> File Path: ', this.file_path_upd.files[0].path);
                    const actual_file_path = require('path').resolve(this.file_path_upd.files[0].path);

                    const file_data = require('fs').readFileSync(actual_file_path);
                    const file_base64_str =
                      `data:${this.file_path_upd.files[0].type};base64,${file_data.toString('base64')}`;
                    
                    safety_document.document.file = file_base64_str;
                    safety_document.document.content_type = this.file_path_upd.files[0].type;

                    if(!safety_document.document.filename) // if filename hasn't been manually entered
                      safety_document.document.filename = this.file_path_upd.files[0].name.split('.')[0];

                    // this.setState({selected_safety_document: safety_document});

                    // dispatch action to update the safety document on local & remote stores
                    this.props.dispatch(
                    {
                      type: ACTION_TYPES.SAFETY_DOC_UPDATE,
                      payload: safety_document // this.state.selected_safety_document
                    });
                  } else 
                  {
                    this.props.dispatch(
                    {
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'warning',
                        message: 'Cancelled file upload because an invalid document was chosen.',
                      },
                    });
                  }
                }}
              />
            </p>
          </div>
        </div>
      </div>);
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
    this.setState({ is_new_safety_doc_modal_open: true });
  }
 
  afterOpenModal()
  {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#2FA7FF';
  }
 
  closeModal()
  {
    this.setState({is_new_safety_doc_modal_open: false});
  }

  // Render
  render()
  {
    const { safetyDocuments, t } = this.props;
    
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
        <p style={{color: '#fff', marginTop: '5px'}}>{this.state.info.message}</p>
      </div>);
      
    return (
      <PageContent bare>
        {info}
        <div style={{maxHeight: 'auto'}}>
          {/* SafetyDocuments table & Column toggles */}
          <div style={{paddingTop: '0px'}}>
            {/* SafetyDocuments Table column toggles */}
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
              <div ref={(r)=>this.toggle_container = r} key='safety_documents_col_toggles' style={{boxShadow: '0px 10px 35px #343434', marginLeft: 'auto', marginRight: 'auto', position: 'fixed', top:  '130px', width: '1150px'}}>
                <h2 style={{textAlign: 'center', fontWeight: 'lighter'}}>Show/Hide Table Columns</h2>
                <Part>
                  <Row>
                    {/* ID column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Document&nbsp;ID</label>
                      <label className="switch">
                        <input
                          name="toggle_safety_doc_id"
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
                      <label className="itemLabel">Document&nbsp;No.</label>
                      <label className="switch">
                        <input
                          name="toggle_safety_doc_number"
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


                    {/* File path column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Document&nbsp;Title</label>
                      <label className="switch">
                        <input
                          name="toggle_title"
                          type="checkbox"
                          checked={this.state.col_doc_title_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_doc_title_visible: !this.state.col_doc_title_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Filename column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Description</label>
                      <label className="switch">
                        <input
                          name="toggle_description"
                          type="checkbox"
                          checked={this.state.col_doc_desc_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_doc_desc_visible: !this.state.col_doc_desc_visible
                            });
                            // this.toggleColumnVisibility()
                          }}
                        />
                        <span className="slider round" />
                      </label>
                    </Field>

                    {/* Content Type column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Document&nbsp;Type</label>
                      <label className="switch">
                        <input
                          name="toggle_doc_type"
                          type="checkbox"
                          checked={this.state.col_doc_type_visible}
                          onChange={() =>
                          {
                            this.setState(
                            {
                              col_doc_type_visible: !this.state.col_doc_type_visible
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
                    <Button onClick={this.openModal} success>New&nbsp;Safety&nbsp;Doc</Button>
                    <Button
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
                    Toggle&nbsp;Filters
                    </Button>
                  </Row>
                </Part>
              </div>
            </Transition>

            {/* Safety doc creation Modal */}
            <Modal
              isOpen={this.state.is_new_safety_doc_modal_open}
              onAfterOpen={this.afterOpenModal}
              onRequestClose={this.closeModal}
              style={modalStyle}
              contentLabel="Create New Safety Document Reference"
            >
              <h2 ref={subtitle => this.subtitle = subtitle} style={{color: 'black'}}>Create&nbsp;New&nbsp;Safety&nbsp;Document&nbsp;Reference</h2>
              <div>
                <div className="row">
                  <div className="pageItem col-md-6">
                    <label className="itemLabel">File</label>
                    <input
                      name="file_path"
                      type="file"
                      ref={(file_path) => this.file_path = file_path}
                      onChange={(new_val)=>
                      {
                        const safety_document = this.state.new_safety_document;

                        console.log('>>>>>> Chosen File: ', this.file_path.files[0]);
                        console.log('>>>>>> File Path: ', this.file_path.files[0].path);
                        const actual_file_path = require('path').resolve(this.file_path.files[0].path);

                        const file_data = require('fs').readFileSync(actual_file_path);
                        const file_base64_str =
                          `data:${this.file_path.files[0].type};base64,${file_data.toString('base64')}`;

                        // console.log('>>>>>> File Base64: ', file_base64_str);
                        safety_document.document.file = file_base64_str;
                        safety_document.document.content_type = this.file_path.files[0].type;

                        if(!safety_document.document.filename) // if hasn't been manually entered
                          safety_document.document.filename = this.file_path.files[0].name.split('.')[0];

                        this.setState({new_safety_document: safety_document});

                        console.log('>>>>>> New Safety Doc: ', safety_document);
                      }}
                      style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                    />
                  </div>

                  <div className="pageItem col-md-6">
                    <label className="itemLabel">Document&nbsp;Title</label>
                    <input
                      ref={(txt_document_title)=>this.txt_document_title = txt_document_title}
                      name="document_title"
                      type="text"
                      value={this.state.new_safety_document.document.filename}
                      onChange={(new_val)=>
                      {
                        const safety_document = this.state.new_safety_document;
                        safety_document.document.filename = new_val.currentTarget.value;
                        this.setState({new_safety_document: safety_document});
                      }}
                      style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="pageItem col-md-6">
                    <label className="itemLabel">Document&nbsp;Description</label>
                    <textarea
                      name="notes"
                      value={this.state.new_safety_document.other}
                      onChange={this.handleInputChange}
                      style={{width: '580px', border: '1px solid #2FA7FF', borderRadius: '3px'}}
                    />
                  </div>
                </div>

                <Button
                  onClick={this.closeModal}
                  style={{width: '120px', height: '50px', float: 'right'}}
                  danger
                >Dismiss
                </Button>

                <Button
                  onClick={()=>
                  {
                    const safety_document = this.state.new_safety_document;

                    if(!safety_document.document.filename)
                    {
                      return this.props.dispatch({
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: {
                          type: 'danger',
                          message: 'Invalid document title.',
                        },
                      });
                    }

                    if(!safety_document.document.file)
                    {
                      return this.props.dispatch({
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: {
                          type: 'danger',
                          message: 'Invalid file. Please choose a valid file from the file chooser.',
                        },
                      });
                    }

                    // Prepare Safety Document
                    // Update common attributes
                    safety_document.object_number = this.props.safetyDocuments.length;
                    safety_document.document_title = this.state.new_safety_document.document.filename;
                    safety_document.document_description = this.state.new_safety_document.document.other;
                    safety_document.document_type = this.state.new_safety_document.document.content_type;
                    safety_document.creator_name = SessionManager.session_usr.name;
                    safety_document.creator = SessionManager.session_usr.usr;
                    safety_document.creator_employee = SessionManager.session_usr;
                    safety_document.date_logged = new Date().getTime();// current date in epoch millis
                    safety_document.logged_date = formatDate(new Date());// current date
                    // Update common attributes for actual document
                    safety_document.document.creator_name = SessionManager.session_usr.name;
                    safety_document.document.creator = SessionManager.session_usr.usr;
                    safety_document.document.creator_employee = SessionManager.session_usr;
                    safety_document.document.date_logged = new Date().getTime();// current date in epoch millis
                    safety_document.document.logged_date = formatDate(new Date());// current date

                    this.setState({new_safety_document: safety_document, is_new_safety_document_modal_open: false});

                    this.props.safetyDocuments.push(this.state.new_safety_document);
                    mapStateToProps(this.state);

                    // dispatch action to create safety_document on local & remote stores
                    this.props.dispatch({
                      type: ACTION_TYPES.SAFETY_DOC_NEW,
                      payload: this.state.new_safety_document
                    });
                    
                  }}
                  style={{width: '120px', height: '50px', float: 'left'}}
                  success
                >Create
                </Button>
              </div>
            </Modal>

            {/* List of SafetyDocuments */}
            {safetyDocuments.length === 0 ? (
              <Message danger text='No safety docs were found in the system' style={{marginTop: '145px'}} />
            ) : (
              <div style={{maxHeight: 'auto', marginTop: '20px', marginLeft: '-40px', backgroundColor: '#2BE8A2'}}>
                <BootstrapTable
                  id='tblSafetyDocuments'
                  key='tblSafetyDocuments'
                  data={safetyDocuments}
                  striped
                  hover
                  insertRow={false}
                  // selectRow={(row)=>alert(row)}
                  selectRow={{bgColor: 'red'}}
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
                    // isKey
                    dataField='_id'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed', left: '190px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_id_visible}
                  > Safety&nbsp;Doc&nbsp;ID
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
                  >Document&nbsp;Number
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='document_title'
                    dataSort
                    caretRender={this.getCaret}
                    // editable={{type: 'text'}}
                    // thStyle={{position: 'fixed', left: this.state.col_id_end + 240 + 'px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_doc_title_visible}
                  >Document&nbsp;Title
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='document_description'
                    dataSort
                    caretRender={this.getCaret}
                    // editable={{type: 'text'}}
                    // thStyle={{position: 'fixed', left: this.state.col_id_end + 240 + 'px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_doc_desc_visible}
                  >Document&nbsp;Description
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='document_type'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_doc_type_visible}
                  > Document&nbsp;Type
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
SafetyDocuments.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  safetyDocuments: PropTypes.arrayOf(PropTypes.object).isRequired,
   t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
  employees: getEmployees(state),
  safetyDocuments: getSafetyDocuments(state),
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(SafetyDocuments);
