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

// Components
import SideBar from './containers/SideBar';
import MainContent from './containers/MainContent';

// Actions
import * as ActionsCreator from './actions';

// Selectors
import { getConfigs, getQuote, getInvoice, getProfile } from './reducers';

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
    ipc.on('update-quote-preview', (event, objectData) =>
    {
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

    ipc.on('pfd-exported', (event, options) =>
    {
      const noti = Notify(options);
      // Handle click on notification
      noti.onclick = () =>
      {
        ipc.send('reveal-file', options.location);
      };
    });
  }

  componentWillUnmount()
  {
    ipc.removeAllListeners(
    [
      'pfd-exported',
      'update-quote-preview',
      'update-invoice-preview',
      'update-preview-window',
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
            <SideBar
              configs={configs}
              pdf_data={this.state.pdf_data}
              updateConfigs={this.updateConfigs}
              t={t}
            />
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
