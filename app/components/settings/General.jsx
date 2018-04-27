// Libraries
import React, { Component } from 'react';
import PropTypes from 'prop-types';
const ipc = require('electron').ipcRenderer;

// Custom Libs
const openDialog = require('../../renderers/dialog.js');
import _withFadeInAnimation from '../shared/hoc/_withFadeInAnimation';

import Other from './_partials/general/Other';

// Component
class General extends Component
{
  constructor(props)
  {
    super(props);
    // this.state = this.props.invoice;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCurrencyChange = this.handleCurrencyChange.bind(this);
  }

  componentWillMount()
  {
    this.setState(this.props.general);
  }

  componentDidMount()
  {
    const { t } = this.props;
    ipc.on('no-access-directory', (event, message) =>
    {
      openDialog(
      {
        type: 'warning',
        title: t('dialog:noAccess:title'),
        message: `${message}. ${t('dialog:noAccess:message')}`,
      });
    });

    ipc.on('confirmed-export-directory', (event, path) =>
    {
      this.setState({ exportDir: path }, () =>
      {
        this.props.updateSettings('invoice', this.state);
      });
    });
  }

  handleInputChange(event)
  {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value }, () =>
    {
      this.props.updateSettings('general', this.state);
    });
  }

  handleCurrencyChange(event)
  {
    const target = event.target;
    const name = target.name;
    const value = name === 'fraction' ? parseInt(target.value, 10) : target.value;
    this.setState(
      {
        currency: Object.assign({}, this.state.currency,
          {
          [name]: value,
        }),
      },
      () =>
      {
        this.props.updateSettings('invoice', this.state);
      }
    );
  }

  selectExportDir()
  {
    ipc.send('select-export-directory');
  }

  render()
  {
    const { t } = this.props;
    const {
      exportDir,
      template,
      currency,
      dateFormat
    } = this.state;

    return (
      <div>
        <div className="row">
          <div className="col-md-6">
            <div className="pageItem">
              <label className="itemLabel">{t('settings:fields:sound')}</label>
              <select
                name="sound"
                value={this.state.sound}
                onChange={this.handleInputChange}
              >
                <option value="default">{t('common:default')}</option>
                <option value="cs">Counter Strike</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="pageItem">
              <label className="itemLabel">{t('settings:fields:mute')}</label>
              <label className="switch">
                <input
                  name="muted"
                  type="checkbox"
                  checked={this.state.muted}
                  onChange={this.handleInputChange}
                />
                <span className="slider round" />
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="pageItem">
              <label className="itemLabel">{t('settings:fields:language:name')}</label>
              <select
                name="language"
                value={this.state.language}
                onChange={this.handleInputChange}
              >
                <option value="de">{t('settings:fields:language:de', { lng: 'de' })}</option>
                <option value="en">{t('settings:fields:language:en', { lng: 'en' })}</option>
                <option value="fr">{t('settings:fields:language:fr', { lng: 'fr' })}</option>
                <option value="id">{t('settings:fields:language:id', { lng: 'id' })}</option>
                <option value="it">{t('settings:fields:language:it', { lng: 'it' })}</option>
                <option value="sk">{t('settings:fields:language:sk', { lng: 'sk' })}</option>
                <option value="ur-PK">{t('settings:fields:language:ur-PK', { lng: 'ur-PK' })}</option>
                <option value="vi">{t('settings:fields:language:vi', { lng: 'vi' })}</option>
                <option value="zh-CN">{t('settings:fields:language:zh-CN', { lng: 'zh-CN' })}</option>
              </select>
            </div>
          </div>
          <div className="col-md-6">
            <div className="pageItem">
              <label className="itemLabel">{t('settings:fields:openPDFReader')}</label>
              <label className="switch">
                <input
                  name="previewPDF"
                  type="checkbox"
                  checked={this.state.previewPDF}
                  onChange={this.handleInputChange}
                />
                <span className="slider round" />
              </label>
            </div>
          </div>
        </div>
        <div className="row">
          <Other
            key="other_settings"
            dateFormat={dateFormat}
            exportDir={exportDir}
            template={template}
            handleInputChange={this.handleInputChange}
            selectExportDir={this.selectExportDir}
            t={t}
          />
        </div>
      </div>
    );
  }
}

General.propTypes = {
  general: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  updateSettings: PropTypes.func.isRequired,
};

export default _withFadeInAnimation(General);
