// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const openDialog = require('../../renderers/dialog.js');
const ipc = require('electron').ipcRenderer;

import { translate } from 'react-i18next';

import Option from 'muicss/lib/react/option';
import Select from 'muicss/lib/react/select';

// Animation
import _withFadeInAnimation from '../../components/shared/hoc/_withFadeInAnimation';
import { Motion, spring } from 'react-motion';
import Transition from 'react-motion-ui-pack'

// Global constants
import * as GlobalConstants from  '../../constants/globals';

// Actions
import * as ACTION_TYPES from '../../constants/actions.jsx';
import * as UIActions from '../../actions/ui';

// Selectors
import { getEmployees } from '../../reducers/HR/EmployeesReducer';
import { getMaterials } from '../../reducers/Operations/MaterialsReducer';
import { getClients } from '../../reducers/Operations/ClientsReducer';
import { getQuotes } from '../../reducers/Operations/QuotesReducer';
import { getQuotesTable } from '../../App'

// Components
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import Quote from '../../components/quotes/Quote';
import ComboBox from '../../components/shared/ComboBox';

import Message from '../../components/shared/Message';
import Button, { ButtonsGroup } from '../../components/shared/Button';
import CloseButton from '../../components/shared/CloseButton';
import { Field, Part, Row } from '../../components/shared/Part';
import Logo from '../../components/settings/_partials/profile/Logo';

import Modal from 'react-modal';

// Styles
import styled from 'styled-components';

// Helpers
import * as SessionManager from '../../helpers/SessionManager';
import Log from '../../helpers/Logger';

import
  {
    PageWrapper,
    PageHeader,
    PageHeaderTitle,
    PageHeaderActions,
    PageContent,
  } from '../../components/shared/Layout';
import { globalShortcut } from 'electron';


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

const ExtraCost = styled.div`
  background: rgba(255,255,255,.3);
  border-radius: 6px;
  border: 1px solid #fff;
  height: 25px;
  // Hover
  &:hover {
    cursor: pointer;
    background: rgba(255,255,255,.7);
  }
`;

export class Quotes extends React.Component
{
  constructor(props)
  {
    super(props);
    
    this.editQuote = this.editQuote.bind(this);
    this.deleteQuote = this.deleteQuote.bind(this);
    this.duplicateQuote = this.duplicateQuote.bind(this);
    this.setQuoteStatus = this.setQuoteStatus.bind(this);
    this.expandComponent = this.expandComponent.bind(this);
    this.getCaret = this.getCaret.bind(this);
    
    // this.creator_ref = React.createRef();
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.col_toggles_container = null;
    this.col_width = 235;
    this.state = {  filter: null,
                    is_new_quote_modal_open: false,
                    is_quote_items_modal_open: false,
                    selected_quote: {extra_costs: []},
                    active_row: null,
                    column_toggles_top: -200,
                    info: {x: 200, y: 200, display: 'none'},
                    extra_cost_modal_props: {x: 0, y: 0, visible: false, edit_mode: false},
                    selected_extra_cost:
                    {
                      quote_item_id: null,
                      object_number: 0,
                      title: '',
                      cost: 0,
                      markup: 0,
                      creator: SessionManager.session_usr.usr,
                      creator_employee: SessionManager.session_usr,
                      date_logged: new Date().getTime()
                    },
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
                    // Quote to be created
                    new_quote:
                    {
                      client_id: null,
                      client: null,
                      contact_id: null,
                      contact: null,
                      request: null,
                      sitename: null,
                      notes: null,
                      vat: GlobalConstants.VAT,
                      status: 0,
                      resources: []
                    },
                    // Quote Item to be added
                    new_quote_item:
                    {
                      resource_id: null,
                      unit_cost: 0,
                      quantity: 1,
                      markup: 0,
                      additional_costs: ''
                    }
    };
  }

  // Load Quotes & add event listeners
  componentDidMount()
  {
    // Add Event Listener
    ipc.on('confirmed-delete-quote', (event, index, quoteId) =>
    {
      if (index === 0)
      {
        this.confirmedDeleteQuote(quoteId);
      }
    });
  }

  // Remove all IPC listeners when unmounted
  componentWillUnmount()
  {
    ipc.removeAllListeners('confirmed-delete-quote');
  }

  // Open Confirm Dialog
  deleteQuote(quoteId)
  {
    const { t } = this.props;
    openDialog(
      {
        type: 'warning',
        title: t('dialog:deleteQuote:title'),
        message: t('dialog:deleteQuote:message'),
        buttons: [
          t('common:yes'),
          t('common:noThanks')
        ],
      },
      'confirmed-delete-quote',
      quoteId
    );
  }

  showQuotePreview(quote)
  {
    // Preview Window
    ipc.send('preview-quote', quote);
  }

  // Confirm Delete an quote
  confirmedDeleteQuote(quoteId)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.deleteQuote(quoteId));
  }

  // set the quote status
  setQuoteStatus(quoteId, status)
  {
    alert('set status to: ' + status);
    const { dispatch } = this.props;
    // dispatch(Actions.setQuoteStatus(quoteId, status));
  }

  editQuote(quote)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.editQuote(quote));
  }

  duplicateQuote(quote)
  {
    const { dispatch } = this.props;
    // dispatch(Actions.duplicateQuote(quote));
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
        // quotes.filter(q => q.id < 3).map(p => p.id)
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

    const quote_options = (
      <div>
        <Button primary onClick={() => this.showQuotePreview(row)}>PDF Preview</Button>
        <Button
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

            // Prepare Job
            const new_job =
            {
              // object_number = this.props.quotes.length,
              quote_id: row._id,
              quote: row,
              client_name: row.client_name,
              client: row.client,
              contact_person: row.contact_person,
              contact: row.contact,
              request: row.request,
              sitename: row.sitename,
              vat: row.vat,
              creator_name: SessionManager.session_usr.name,
              status: 0,
              quote_revisions: row.revision,
              tasks: [],
              creator: SessionManager.session_usr.usr,
              creator_employee: SessionManager.session_usr,
              date_logged: new Date().getTime()/1000 // current date in epoch SECONDS
            }

            // this.props.jobs.push(new_job);

            // ipc.send(evt, 'change-operations-tab', 2);

            // dispatch action to create job on local & remote stores
            this.props.dispatch({
              type: ACTION_TYPES.JOB_NEW,
              payload: new_job
            });

            // this.props.changeTab(2);
          }}
        >Create&nbsp;New&nbsp;Job
        </Button>
      </div>
    );

    const new_quote_item_form = (
      <div>
        {/* form for adding a new QuoteItem */}
        <div style={{backgroundColor: 'rgba(255,255,255,.6)', borderRadius: '4px', marginTop: '20px'}}>
          <h3 style={{textAlign: 'center', 'fontWeight': 'lighter'}}>Add&nbsp;materials&nbsp;to&nbsp;quote&nbsp;#{row.object_number}</h3>
          <div className="row">
            <div className="pageItem col-md-6">
              <label className="itemLabel">Material</label>
              <div>
                <ComboBox
                  items={this.props.materials}
                  label='resource_description'
                    // defaultValue={this.props.materials[0]}
                  onUpdate={(newValue) =>
                    {
                      // get selected value
                      const selected_mat = JSON.parse(newValue);

                      this.unit_cost.value = selected_mat.resource_value;

                      // create quote_item obj
                      const quote_item =
                      {
                        item_number: row.resources.length,
                        quote_id: row._id,
                        resource_id: selected_mat._id,
                        unit_cost: selected_mat.resource_value,
                        quantity: 1,
                        unit: selected_mat.unit,
                        item_description: selected_mat.resource_description
                      };

                      // update state
                      this.setState({new_quote_item: quote_item});
                    }}
                />
              </div>
            </div>

            <div className="pageItem col-md-6">
              <label className="itemLabel">Unit&nbsp;Cost</label>
              <input
                id="unit_cost"
                ref={(unit_cost)=>this.unit_cost=unit_cost}
                name="unit_cost"
                type="text"
                value={this.state.new_quote_item.unit_cost}
                onChange={(new_val)=> {
                    const quote_item = this.state.new_quote_item;
                    
                    quote_item.unit_cost = new_val.currentTarget.value;
                    this.setState({new_quote_item: quote_item});
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
                value={this.state.new_quote_item.quantity}
                onChange={(new_val)=> {
                    const quote_item = this.state.new_quote_item;
                    
                    quote_item.quantity = new_val.currentTarget.value;
                    this.setState({new_quote_item: quote_item});
                  }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>

            <div className="pageItem col-md-6">
              {/* <label className="itemLabel">Unit</label>
              <input
                name="unit"
                type="text"
                disabled
                value={this.state.new_quote_item.unit}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              /> */}
              <div style={{width: '300px', marginLeft: 'auto', marginRight: 'auto', marginTop: '25px'}}>
                <Button
                  success
                  style={{width: '120px', height: '50px', float: 'left'}}
                  onClick={() =>
                  {
                    if(this.state.new_quote_item.resource_id && this.state.new_quote_item.quote_id)
                    {
                      const quote_item = this.state.new_quote_item;
                      quote_item.date_logged = new Date().getTime()/1000; // epoch sec
                      quote_item.creator = SessionManager.session_usr.usr;
                      console.log('creating new quote item: ', quote_item);

                      row.resources.push(quote_item);
                      // update state
                      this.setState({new_quote_item: quote_item});
                      // signal add quote item
                      this.props.dispatch({
                        type: ACTION_TYPES.QUOTE_ITEM_ADD,
                        payload: quote_item
                      });

                      // TODO: fix this hack
                      // signal update quote - so it saves to local storage
                      this.props.dispatch({
                        type: ACTION_TYPES.QUOTE_UPDATE,
                        payload: row
                      });
                      // this.setState(this.state.new_quote_item);
                    } else
                      this.props.dispatch({
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: {type: 'danger', message: 'Chosen material is invalid.\nPlease select a valid material from the drop down list'}
                      });
                      // openDialog(
                      //   {
                      //     type: 'warning',
                      //     title: 'Could not add material to quote',
                      //     message: 'Please select a valid material from the drop down list'
                      //   }
                      // );
                      /* buttons: [
                        t('common:yes'),
                        t('common:noThanks')
                      ] */
                  }}
                >Add
                </Button>
                <Button style={{width: '120px', height: '50px', float: 'left', marginLeft: '15px'}} danger>Reset Fields</Button>
              </div>
            </div>
          </div>
        </div> 
      </div>
    );
    // console.log('-<><><><><>:-< ', row.resources)
    return  (
      row.resources.length === 0 ? (
        <div>
          { /* Quote options */ }
          { quote_options }
          <Message danger text='Quote has no resources.' style={{marginTop: '20px'}} />
          {/* form for adding a new QuoteItem */}
          {new_quote_item_form}
        </div>
      ) :
        <div style={{maxHeight: 'auto'}}>
          { /* Quote options */ }
          { quote_options }
          <h3 style={{textAlign: 'center', 'fontWeight': 'lighter'}}>List&nbsp;of&nbsp;materials&nbsp;for&nbsp;quote&nbsp;#{row.object_number}</h3>
          <BootstrapTable
            id='tblQuoteResources'
            key='tblQuoteResources'
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
              dataField='item_number'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_object_number_visible}
            >Item&nbsp;No.
            </TableHeaderColumn>

            <TableHeaderColumn
              isKey
              dataField='item_description'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_object_number_visible}
            >Description
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='unit_cost'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_client_id_visible}
            >Cost
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='quantity'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_contact_person_id_visible}
            >Quantity
            </TableHeaderColumn>
            
            <TableHeaderColumn
              dataField='unit'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_sitename_visible}
            >Unit
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='extra_costs_summary'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              // hidden={!this.state.col_request_visible}
              customEditor={{
                getElement: (func, props) =>
                {
                  const quote = props.row;
                  if(!quote.extra_costs)
                    quote.extra_costs = [];
                  // this.state.selected_quote = row;
                  // if(!this.state.selected_quote.extra_costs)
                  //   this.state.selected_quote.extra_costs = [];
                  return (
                    <div style={{backgroundColor: 'rgba(0,0,0,.3)', borderRadius: '4px', border: '2px solid #5BA5E8'}}>
                      {/* <ComboBox
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
                      /> */}
                      <Button
                        success
                        style={{marginLeft: '5%'}}
                        onClick={(evt)=>
                        {
                          const modal = this.state.extra_cost_modal_props;
                          modal.x = evt.clientX - 450;
                          modal.y = evt.clientY - 30;
                          modal.visible = true;// !modal.visible;
                          this.setState(
                            {
                              selected_quote: row,
                              selected_extra_cost: // Object.assign( this.state.selected_extra_cost,
                                                    {
                                                      _id: null,
                                                      quote_item_id: null,
                                                      object_number: 0,
                                                      title: '',
                                                      cost: 0,
                                                      markup: 0,
                                                      creator: SessionManager.session_usr.usr,
                                                      creator_employee: SessionManager.session_usr,
                                                      date_logged: new Date().getTime()
                                                    },
                              extra_cost_modal_props: modal,
                              selected_quote_item: props.row,
                              edit_mode: false
                            });
                        }}
                      >
                        New&nbsp;Cost
                      </Button>

                      {/* Show list of current additional costs with delete button */}
                      <div ref={(r)=> this.extra_costs_container =r}>
                        {
                          quote.extra_costs.length > 0 ? 
                            quote.extra_costs.map( extra_cost =>
                            {
                              const cost = Number(extra_cost.cost);
                              const markup = Number(extra_cost.markup);

                              const markedup_cost = cost + (cost * (markup/100));
                              return (
                                <ExtraCost
                                  key={extra_cost.object_number}
                                  style={{marginTop: '7px'}}
                                  onClick={()=>
                                      this.setState(
                                        {
                                          selected_quote: row,
                                          selected_quote_item: props.row,
                                          selected_extra_cost: extra_cost,
                                          extra_cost_modal_props: Object.assign(this.state.extra_cost_modal_props,
                                                                  { visible: true, edit_mode: true })
                                        })}
                                >
                                  <p style={{marginTop: '2px', marginLeft: '2px'}}>
                                    <i style={{fontWeight: 'lighter', textAlign: 'left', float: 'left'}}>{extra_cost.title}</i>
                                    <em style={{ textAlign: 'right', float: 'right'}}>{GlobalConstants.currency_symbol} {markedup_cost}</em>
                                  </p>
                                </ExtraCost>)
                            }) : 
                          (<p style={{textAlign: 'center'}}>No extra costs.</p>)
                        }
                      </div>
                    </div>)
                }
              }}
            >Extra&nbsp;Costs
            </TableHeaderColumn>

            <TableHeaderColumn
              dataField='other'
              dataSort
              caretRender={this.getCaret}
              tdStyle={{'fontWeight': 'lighter', whiteSpace: 'normal'}}
              thStyle={{ whiteSpace: 'normal' }}
              hidden
            >Notes
            </TableHeaderColumn>
          </BootstrapTable>
          
          {/* form for adding a new QuoteItem */}
          {new_quote_item_form}
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
    this.setState({ is_new_quote_modal_open: true });
  }
 
  afterOpenModal()
  {
    // references are now sync'd and can be accessed.
    this.subtitle.style.color = '#2FA7FF';
  }
 
  closeModal()
  {
    this.setState({is_new_quote_modal_open: false});
  }

  handleQuoteUpdate(evt, quote)
  {
    if(evt.key === 'Enter')
    {
      Log('verbose_info', 'updating quote: ' +  quote);
      this.props.dispatch({
        type: ACTION_TYPES.QUOTE_UPDATE,
        payload: Object.assign(quote, { creator: SessionManager.session_usr.usr })
      });
    }
  }

  // Render
  render()
  {
    const { quotes, t } = this.props;
    
    const cellEditProp =
    {
      mode: 'click',
        // if product id less than 3, will cause the whole row noneditable
        // this function should return an array of row keys
        // quotes.filter(q => q.id < 3).map(p => p.id)
      nonEditableRows: () => ['_id', 'object_number', 'date_logged', 'creator', 'creator_name'],
      blurToSave: true,
      beforeSaveCell: this.onBeforeSaveCell, // a hook for before saving cell
      afterSaveCell: this.onAfterSaveCell  // a hook for after saving cell
    };

    const options =
    {
      defaultSortName: 'object_number',  // default sort column name
      defaultSortOrder: 'desc',
      expandRowBgColor: 'rgba(0, 0, 0, .4)',
    };

    const info = (
      <div style={{position: 'fixed', display: this.state.info.display, top: this.state.info.y, left: this.state.info.x, background:'rgba(0,0,0,.8)', borderRadius: '4px', boxShadow: '0px 0px 10px #343434', border: '1px solid #000', zIndex: '300'}}>
        <p style={{color: '#fff', marginTop: '5px'}}>&nbsp;click&nbsp;to&nbsp;sort&nbsp;by&nbsp;this&nbsp;column&nbsp;</p>
      </div>);

    // const clientFormatter = (cell, row) => (<div>test</div>);
    const clientFormatter = (cell, row) => `<i class='glyphicon glyphicon-${cell.client_name}'></i> ${cell.client_name}`;

    return (
      <PageContent bare>
        <div style={{maxHeight: 'auto'}}>
          {info}
          {/* Extra costs modal */}
          <div
            style={{
              position: 'fixed',
              top: this.state.extra_cost_modal_props.y,
              left: this.state.extra_cost_modal_props.x,
              paddingLeft: '40px',
              paddingRight: '40px',
              borderRadius: '10px',
              background: 'rgba(0,0,0,.7)',
              boxShadow: '0px 0px 20px #343434',
              zIndex: '200'
            }}
            hidden={!this.state.extra_cost_modal_props.visible}
          >
            <div style={{paddingTop: '1px', width: '100%'}} >
              <div style={{width: '10px', height: '10px', float: 'right', marginRight: '-30px'}}>
                <CloseButton
                  className="ion-close-circled"
                  onClick={()=>
                    this.setState(
                      {
                        extra_cost_modal_props: Object.assign(this.state.extra_cost_modal_props,
                                                {visible: false, edit_mode: false})
                      })}
                />
              </div>
            </div>
            <div className="row">
              <div className="pageItem" style={{paddingTop: '5px'}}>
                <label className="itemLabel" style={{color: '#fff'}}>Cost&nbsp;Title</label>
                <input
                  ref={(txt_title)=>this.txt_title = txt_title}
                  name="title"
                  type="text"
                  value={this.state.selected_extra_cost.title}
                  onChange={(new_val)=>
                  {
                    const extra_cost = this.state.selected_extra_cost;
                    extra_cost.title = new_val.currentTarget.value;
                    this.setState({selected_extra_cost: extra_cost});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
              <div className="pageItem" style={{paddingTop: '5px', paddingLeft: '5px'}}>
                <label className="itemLabel" style={{color: '#fff'}}>Cost&nbsp;Value</label>
                <input
                  ref={(txt_cost)=>this.txt_cost = txt_cost}
                  name="cost"
                  type="text"
                  // defaultValue="0"
                  value={this.state.selected_extra_cost.cost}
                  onChange={(new_val)=>
                  {
                    const extra_cost = this.state.selected_extra_cost;
                    extra_cost.cost = new_val.currentTarget.value;
                    this.setState({selected_extra_cost: extra_cost});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
            </div>

            <div className="row" style={{paddingTop: '5px'}}>
              <div className="pageItem">
                <label className="itemLabel" style={{color: '#fff'}}>Markup</label>
                <input
                  ref={(txt_markup)=>this.txt_markup = txt_markup}
                  name="markup"
                  type="text"
                  // defaultValue="0"
                  value={this.state.selected_extra_cost.markup}
                  onChange={(new_val)=>
                  {
                    const extra_cost = this.state.selected_extra_cost;
                    extra_cost.markup = new_val.currentTarget.value;
                    this.setState({selected_extra_cost: extra_cost});
                  }}
                  style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                />
              </div>
              <div className="pageItem" />
              <div className="pageItem">
                <Button
                  success
                  style={
                  {
                    width: '130px',
                    height: '45px',
                    marginTop: '30px',
                    marginLeft: '20px'
                  }}
                  onClick={()=>
                  {
                    if(this.txt_title.value && this.txt_cost.value)
                    {
                      if(this.txt_cost.value.match('^[0-9]+$') == null)
                      {
                        this.props.dispatch(
                        {
                          type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                          payload: { type: 'danger', message: 'Invalid cost. Must be a number greater than or equal to 0.'}
                        });
                        return;
                      }

                      if(this.txt_markup.value)
                      {
                        if(this.txt_markup.value.match('^[0-9]+$') == null)
                        {
                          this.props.dispatch(
                          {
                            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                            payload: { type: 'danger', message: 'Invalid markup. Must be a number greater than or equal to 0.'}
                          });
                          return;
                        }
                      }

                      const extra_cost =
                      {
                        _id: this.state.selected_extra_cost._id,
                        quote_item_id: this.state.selected_quote_item._id,
                        object_number: this.state.selected_quote_item.extra_costs ? this.state.selected_quote_item.extra_costs.length : 0,
                        title: this.txt_title.value,
                        markup: this.txt_markup.value,
                        cost: this.txt_cost.value,
                        date_logged: new Date().getTime(),
                        creator: SessionManager.session_usr.usr,
                        creator_employee: SessionManager.session_usr
                      };

                      // this.setState(
                      //   {
                      //     selected_extra_cost: Object.assign(this.state.selected_extra_cost,
                      //                           {
                      //                             object_number: this.state.selected_quote_item.extra_costs ? this.state.selected_quote_item.extra_costs.length : 0
                      //                           })
                      //   });

                      if(!this.state.selected_quote_item.extra_costs)
                        this.state.selected_quote_item.extra_costs = [];
                      
                      // push new cost to selected_quote_item's list of costs if not in edit mode
                      if(!this.state.extra_cost_modal_props.edit_mode)
                        this.state.selected_quote_item.extra_costs.push(extra_cost);

                      // update state
                      this.setState(
                      {
                        selected_quote_item: this.state.selected_quote_item,
                        extra_cost_modal_props: this.state.extra_cost_modal_props.edit_mode ? this.state.extra_cost_modal_props :
                                                Object.assign(this.state.extra_cost_modal_props, {visible: false}),
                        // if is editing leave current as selected, else if adding reset selected_extra_cost
                        selected_extra_cost: this.state.extra_cost_modal_props.edit_mode ? extra_cost :
                                              {
                                                quote_item_id: null,
                                                index: 0,
                                                title: '',
                                                cost: 0,
                                                markup: 0,
                                                creator: SessionManager.session_usr.usr,
                                                creator_employee: SessionManager.session_usr,
                                                date_logged: new Date().getTime()
                                              }
                      });

                      console.log('selected quote: ', this.state.selected_quote);
                      console.log('selected quote_item: ', this.state.selected_quote_item);
                      console.log('selected quote_item extra_cost: ', extra_cost);


                      // signal quote item add (if in edit mode) to save new extra cost to remote storage
                      if(!this.state.extra_cost_modal_props.edit_mode)
                        this.props.dispatch(
                        {
                          type: ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_ADD,
                          payload: extra_cost
                        });
                      else // else signal quote item update to update extra cost on remote storage
                        this.props.dispatch(
                        {
                          type: ACTION_TYPES.QUOTE_ITEM_EXTRA_COST_UPDATE,
                          payload: extra_cost
                        });

                      // signal update quote - so it saves new extra costs to local storage
                      this.props.dispatch(
                      {
                        type: ACTION_TYPES.QUOTE_UPDATE,
                        payload: this.state.selected_quote
                      });
                    } else
                      this.props.dispatch(
                      {
                        type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                        payload: { type: 'danger', message: 'Please make sure that the cost and title fields have been filled in correctly.'}
                      });
                  }}
                >
                  { this.state.extra_cost_modal_props.edit_mode ? 'Update' : 'Add' }
                </Button>
              </div>
            </div>
          </div>
          {/* Quote Creation Modal */}
          <Modal
            isOpen={this.state.is_new_quote_modal_open}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={modalStyle}
            contentLabel="New Quote Modal"
          >
            <h2 ref={subtitle => this.subtitle = subtitle} style={{color: 'black'}}>Create New Quote</h2>
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
                  <label className="itemLabel">{t('common:fields:company')}</label>
                  <div>
                    <ComboBox
                      ref={(cbx_clients)=>this.cbx_clients = cbx_clients}
                      items={this.props.clients}
                        // selected_item={this.state.new_quote.client}
                      label='client_name'
                      onUpdate={(new_val)=>{
                          const selected_client = JSON.parse(new_val);
                          
                          const quote = this.state.new_quote;
                          quote.client_id = selected_client._id;
                          quote.client = selected_client;

                          this.setState({new_quote: quote});
                          this.sitename = selected_client.physical_address;
                        }}
                    />
                  </div>
                </div>
                <div className="pageItem col-md-6">
                  <label className="itemLabel"> Contact </label>
                  {/* TODO: common:fields:email? */}
                  <div>
                    <ComboBox 
                      ref={(cbx_contacts)=>this.cbx_contacts = cbx_contacts}
                      items={this.props.employees}
                        // selected_item={this.state.new_quote.contact}
                      label='name'
                      onUpdate={(new_val)=>{
                          const selected_contact = JSON.parse(new_val);
                          const quote = this.state.new_quote;
                          quote.contact_id = selected_contact.usr;
                          quote.contact = selected_contact;

                          this.setState({new_quote: quote});
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
                    // value={this.state.new_quote.sitename}
                    onChange={(new_val)=>{
                      const quote = this.state.new_quote;
                      quote.sitename = new_val.currentTarget.value;
                      this.setState({new_quote: quote});
                    }}
                    style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>

                <div className="pageItem col-md-6">
                  <label className="itemLabel">Request</label>
                  <input
                    name="request"
                    type="text"
                    ref={(txt_request)=>this.txt_request = txt_request}
                    onChange={(new_val)=>{
                      const quote = this.state.new_quote;
                      quote.request = new_val.currentTarget.value;
                      this.setState({new_quote: quote});
                    }}
                    style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
                  />
                </div>
              </div>

              <div className="row">
                <div className="pageItem col-md-6">
                  <label className="itemLabel">VAT [{this.state.new_quote.vat} %]</label>
                  <label className="switch">
                    <input
                      name="vat"
                      type="checkbox"
                      checked={this.state.new_quote.vat>0}
                      onChange={() =>
                        {
                          const quote = this.state.new_quote;
                          quote.vat = quote.vat > 0 ? 0 : GlobalConstants.VAT;
                          this.setState(
                          {
                            new_quote: quote
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
                    value={this.state.new_quote.other}
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
                onClick={()=>{
                  const quote = this.state.new_quote;

                  if(!quote.client)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid client selected',
                      },
                    });
                  }

                  if(!quote.contact)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Invalid contact person selected',
                      },
                    });
                  }

                  if(!quote.sitename)
                  {
                    return this.props.dispatch({
                            type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                            payload: {
                              type: 'danger',
                              message: 'Invalid sitename',
                            },
                          });
                  }
                  
                  if(!quote.request)
                  {
                    return this.props.dispatch({
                      type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                      payload: {
                        type: 'danger',
                        message: 'Error: Invalid request',
                      },
                    });
                  }

                  // Prepare Quote
                  const client_name = quote.client.client_name.toString();

                  quote.object_number = this.props.quotes.length;
                  quote.client_name = client_name;
                  quote.client_id = quote.client._id;
                  quote.contact_person = quote.contact.name;
                  quote.contact_person_id = quote.contact.usr;
                  quote.account_name = client_name.toLowerCase().replace(' ', '-');
                  quote.creator_name = SessionManager.session_usr.name;
                  quote.creator = SessionManager.session_usr.usr;
                  quote.creator_employee = SessionManager.session_usr;
                  quote.date_logged = new Date().getTime()/1000;// current date in epoch SECONDS

                  this.setState({new_quote: quote, is_new_quote_modal_open: false});

                  this.props.quotes.push(this.state.new_quote);
                  mapStateToProps(this.state);

                  // this.props.dispatch({
                  //   type: ACTION_TYPES.UI_NOTIFICATION_NEW,
                  //   payload: {
                  //     type: 'success',
                  //     message: 'Successfully created new quote',
                  //   },
                  // });

                  // dispatch action to create quote on local & remote stores
                  this.props.dispatch({
                    type: ACTION_TYPES.QUOTE_NEW,
                    payload: this.state.new_quote
                  });
                  
                }}
                style={{width: '120px', height: '50px', float: 'left'}}
                success
              >Create
              </Button>
            </div>
          </Modal>

          {/* Quotes table & Column toggles */}
          <div style={{ paddingTop: '0px' }}>
            
            {/* Quotes Table column toggles */}
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
                left: window.innerWidth * 0.010 + '%',
              }}
            >  
              <div key='col_toggle' style={{boxShadow: '0px 10px 35px #343434', position: 'fixed', top:  '130px', width: '1175px', zIndex: '20'}}>
                <h2 style={{textAlign: 'center', fontWeight: 'lighter'}}>Show/Hide Table Columns</h2>
                <Part>
                  <Row>
                    {/* ID column toggle */}
                    <Field className="col-lg-1 col-md-2 col-sm-3 col-xs-4">
                      <label className="itemLabel">Quote&nbsp;ID</label>
                      <label className="switch">
                        <input
                          name="quoteID"
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
                      <label className="itemLabel">Quote&nbsp;No.</label>
                      <label className="switch">
                        <input
                          name="quoteNumber"
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
                    <Button onClick={this.openModal} success>Create New Quote</Button>
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
                  Toggle Filters
                    </Button>
                  </Row>
                </Part>
              </div>
            </Transition>

            {/* List of Quotes */}
            { quotes.length === 0 ? (
              <Message danger text='No quotes were found in the system' style={{ marginTop: '145px'}} />
            ) : (
              <div style={{maxHeight: 'auto', marginTop: '10px', backgroundColor: '#2BE8A2'}}>
                {/* { getQuotesTable(quotes, this.state, this.props, this.getCaret, this.isExpandableRow, this.expandComponent, this.expandColumnComponent, cellEditProp, clientFormatter, options) } */}
                <BootstrapTable
                  id='tblQuotes'
                  key='tblQuotes'
                  data={quotes}
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
                  pagination
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
                  > Quote ID
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
                  > Quote&nbsp;Number
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='client_name'
                    dataSort
                    caretRender={this.getCaret}
                    // editable={{type: 'select'}}
                    customEditor={{
                      getElement: (func, props) =>
                        <ComboBox items={this.props.clients} selected_item={props.row.client} label='client_name' />
                    }}
                    // thStyle={{position: 'fixed', left: this.state.col_id_end + 240 + 'px', background: 'lime'}}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_client_id_visible}
                  > Client
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
                        <ComboBox items={this.props.users} selected_item={props.row.contact} label='name' />
                    }}
                  > Contact&nbsp;Person
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='sitename'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    customEditor={{
                      getElement: (func, props) => (
                        <input
                          type='text'
                          defaultValue={props.row.sitename}
                          onChange={(val) => {
                            const sel_quo = props.row;
                            sel_quo.sitename = val.currentTarget.value;
                            this.setState( { selected_quote: sel_quo })
                          }}
                          onKeyPress={(evt) => this.handleQuoteUpdate(evt, props.row)}
                        />)
                    }}
                    hidden={!this.state.col_sitename_visible}
                  > Sitename
                  </TableHeaderColumn>

                  <TableHeaderColumn
                    dataField='request'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    customEditor={{
                      getElement: (func, props) => (
                        <input
                          type='text'
                          defaultValue={props.row.request}
                          onChange={(val) => {
                            const sel_quo = props.row;
                            sel_quo.request = val.currentTarget.value;
                            this.setState( { selected_quote: sel_quo })
                          }}
                          onKeyPress={(evt) => this.handleQuoteUpdate(evt, props.row)}
                        />)
                    }}
                    hidden={!this.state.col_request_visible}
                  >Request
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
                    dataField='revision'
                    dataSort
                    caretRender={this.getCaret}
                    // thStyle={{position: 'fixed' }}
                    tdStyle={{'fontWeight': 'lighter'}}
                    hidden={!this.state.col_revision_visible}
                  > Revision
                  </TableHeaderColumn>
                  
                  <TableHeaderColumn
                    dataField='status'
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
                    dataField='date_logged'
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
Quotes.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  // changeTab: PropTypes.func.isRequired,
  employees: PropTypes.arrayOf(PropTypes.object).isRequired,
  materials: PropTypes.arrayOf(PropTypes.object).isRequired,
  clients: PropTypes.arrayOf(PropTypes.object).isRequired,
  quotes: PropTypes.arrayOf(PropTypes.object).isRequired,
   t: PropTypes.func.isRequired,
};

// Map state to props & Export
const mapStateToProps = state => (
{
  employees: getEmployees(state),
  quotes: getQuotes(state),
  clients: getClients(state),
  materials: getMaterials(state)
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(Quotes);
