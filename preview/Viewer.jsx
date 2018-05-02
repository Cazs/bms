// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Notify } from '../helpers/notify';
import { connect } from 'react-redux';
import { compose } from 'recompose';
const ipc = require('electron').ipcRenderer;

// Style
import styled from 'styled-components';
const Wrapper = styled.div`
  display: flex;
  height: 100%;
`;

// Helpers
import Log from '../app/helpers/Logger';
import * as SessionManager from '../app/helpers/SessionManager';
const openDialog = require('../app/renderers/dialog.js');

// Components
import SideBar from './containers/SideBar';
import MainContent from './containers/MainContent';
import Button from '../app/components/shared/Button';

// Actions
import * as ActionsCreator from './actions';

import Modal from 'react-modal';

// Selectors
import { getConfigs, getQuote, getInvoice, getProfile } from './reducers';

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

let is_exporting = false;

// Components
class Viewer extends Component
{
  constructor(props)
  {
    super(props);
    this.updateConfigs = this.updateConfigs.bind(this);
    
    this.state = 
    {
      pdf_data: null,
      type: null
    };
  }

  componentDidMount()
  {
    const { dispatch } = this.props;
    
    ipc.on('update-document-preview', (event, objectData) =>
    {
      if(objectData)
      {
        this.setState({ pdf_data: objectData, type: 'document' });
      }
    });

    ipc.on('update-quote-preview', (event, objectData) =>
    {
      // alert('uodating preview')
      console.log('updating quote preview: ', objectData);

      if(objectData)
      {
        this.setState({ pdf_data: objectData, type: 'quote' });
      }
    });

    ipc.on('update-job-card-preview', (event, objectData) =>
    {
      if(objectData)
      {
        this.setState({ pdf_data: objectData, type: 'job' });
      }
    });

    ipc.on('update-invoice-preview', (event, objectData) =>
    {
      if(objectData)
      {
        this.setState({ pdf_data: objectData, type: 'invoice' });
      }
    });

    ipc.on('update-po-preview', (event, objectData) =>
    {
      if(objectData)
      {
        console.log('showing PDF version of: ', objectData);
        this.setState({ pdf_data: objectData, type: 'po' });
      }
    });

    ipc.on('change-preview-window-language', (event, newLang) =>
    {
      dispatch(ActionsCreator.changeUILanguage(newLang));
    });

    ipc.on('change-preview-window-profile', (event, newProfile) =>
    {
      dispatch(ActionsCreator.updateProfile(newProfile));
    });

    ipc.on('pdf-exported', (event, options) =>
    {
      // alert('pdf-exported');
      const noti = Notify(options);
      // Handle click on notification
      noti.onclick = () =>
      {
        ipc.send('reveal-file', options.location);
      };
    });

    ipc.on('is-exporting', (event, emailing) =>
    {
      // this.setState({is_emailing: true});
      is_exporting = true;
    });
  }

  componentDidUpdate()
  {
    if(is_exporting)
    {
      // alert('exporting PDF')
      // console.log('exporting PDF');
      const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

      const pause = async () =>
      {
        await snooze(500); // sleep for 2 sec, wait for preview to update
        // trigger save-pdf message to export preview content to PDF
        ipc.send('save-pdf', this.state.pdf_data._id);
        is_exporting = false;
      };

      pause();
    }
    ipc.send('updated-preview', this.state.pdf_data);
  }

  componentWillUnmount()
  {
    ipc.removeAllListeners(
    [
      'pfd-exported',
      'updated-preview',
      'update-quote-preview',
      'update-job-card-preview',
      'update-invoice-preview',
      'update-document-preview',
      'update-preview-window'
    ]);
  }

  updateConfigs(config)
  {
    const { dispatch } = this.props;
    dispatch(ActionsCreator.updateConfigs({ name: config.name, value: config.value }));
  }

  render()
  {
    console.log('current state: ', this.state);
    const {  t, configs } = this.props;
    
    return (
        
        this.state.pdf_data ?
        (
          <Wrapper>
            { this.state.type != 'document' ?
              <SideBar
                configs={configs}
                pdf_data={this.state.pdf_data}
                updateConfigs={this.updateConfigs}
                t={t}
              /> : (<div />) }
            <MainContent
              pdf_data={this.state.pdf_data}
              configs={configs}
              type={this.state.type}
              // UILang={UILang}
              t={t}
            />
          </Wrapper>
        ) : (<h1 style={{textAlign: 'center', marginTop: '340px'}}>Loading...</h1>)
    );
  }
}

Viewer.propTypes =
{
  configs: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  // pdf_data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

const mapStateToProps = state => (
{
  configs: getConfigs(state),
  pdf_data: state.pdf_data// getQuote(state),
});

export default compose(
  connect(mapStateToProps),
  translate()
)(Viewer);
