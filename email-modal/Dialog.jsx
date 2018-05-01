// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
const appConfig = require('electron').remote.require('electron-settings');
const BrowserWindow = require('electron').remote.BrowserWindow;
const ipc = require('electron').ipcRenderer;
const mainWindow = BrowserWindow.fromId(appConfig.get('mainWindowID'));

import styled from 'styled-components';

// Helpers
import * as SessionManager from '../app/helpers/SessionManager';
const openDialog = require('../app/renderers/dialog.js');

// Components
import Button from '../app/components/shared/Button';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  background: #f7f7f9;
`;

const Type = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  padding-top: 10px;
  i {
    font-size: 42px;
  }
  ${props =>
    props.type === 'warning' &&
    `
    i { color: #f0ad4e; }
  `} ${props =>
      props.type === 'info' &&
      `
    i { color: #0275d8; }
  `};
`;

const Container = styled.div``;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 2;
  width: 100%;
`;

const Title = styled.h4`
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0;
  ${props =>
    props.type === 'warning' &&
    `
    color: #f0ad4e;
  `} ${props =>
      props.type === 'info' &&
      `
    color: #0275d8;
  `};
`;

const Message = styled.p`
  color: #464a4c;
  text-align: center;
  padding: 0 40px;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const Actions = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: row;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 5px 0;
  ${props =>
    props.type === 'warning' &&
    `
    border-top: 4px solid #f0ad4e;
  `} ${props =>
      props.type === 'info' &&
      `
    border-top: 4px solid #0275d8;
  `} a {
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 5px 30px;
    border-radius: 4px;
    color: #464a4c;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 12px;
    margin: 0 5px;
    -moz-transition: all 0.1s ease-in;
    -o-transition: all 0.1s ease-in;
    -webkit-transition: all 0.1s ease-in;
    transition: all 0.1s ease-in;
    &:hover {
      text-decoration: none;
      background: rgb(2, 117, 216);
      color: white;
    }
  }
`;

// Component
class Dialog extends PureComponent
{
  constructor(props)
  {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount()
  {
    ipc.on('update-modal', (e, dialogOptions, returnChannel, ...rest) =>
    {
      this.setState(
      {
        returnChannel,
        ...dialogOptions,
        rest: [...rest],
      });
    });
  }

  componentWillUnmount()
  {
    ipc.removeAllListeners('update-modal');
  }

  render() {
    return (
      <Wrapper>
        <div>
          <div className="row">
            <div className="pageItem col-md-6">
              <label className="itemLabel">eMail Address</label>
              <input
                ref={(txt_email_address)=>this.txt_email_address = txt_email_address}
                name="email_address"
                type="text"
                    // value={this.state.new_quote.sitename}
                    // onChange={(new_val)=>{
                    //   const quote = this.state.new_quote;
                    //   quote.sitename = new_val.currentTarget.value;
                    //   this.setState({new_quote: quote});
                    // }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>

            <div className="pageItem col-md-6">
              <label className="itemLabel">Subject</label>
              <input
                name="subject"
                type="text"
                ref={(txt_subject)=>this.txt_subject = txt_subject}
                    // onChange={(new_val)=>{
                    //   const quote = this.state.new_quote;
                    //   quote.request = new_val.currentTarget.value;
                    //   this.setState({new_quote: quote});
                    // }}
                style={{border: '1px solid #2FA7FF', borderRadius: '3px'}}
              />
            </div>
          </div>

          <div className="row">
            <div className="pageItem col-md-6">
              <label className="itemLabel">Message</label>
              <textarea
                name="message"
                ref={(txt_message)=>this.txt_message = txt_message}
                    // value={this.state.new_quote.other}
                    // onChange={this.handleInputChange}
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
                  if(!this.txt_email_address.value) // TODO: stricter validation
                  {
                    return openDialog(
                    {
                      type: 'danger',
                      title: 'Error',
                      message: 'Invalid destination email address'
                    });
                  }

                  if(!this.txt_subject.value)
                  {
                    return openDialog(
                    {
                      type: 'danger',
                      title: 'Error',
                      message: 'Invalid subject.'
                    });
                  }

                  if(!this.txt_message.value)
                  {
                    return openDialog(
                    {
                      type: 'danger',
                      title: 'Error',
                      message: 'Invalid message'
                    });
                  }

                  // Prepare eMail
                  const emailProps =
                  {
                    destination: this.txt_email_address.value,
                    subject: this.txt_subject.value,
                    message: this.txt_message.value,
                    metafile: null, // to be generated by mailer
                    quote_id: this.state.selected_quote._id,
                    session_id: SessionManager.session_id,
                    quote: this.state.selected_quote
                  }

                  const appConfig = require('electron-settings');
                  const path = require('path');
                  const fs = require('fs');
                  const exportDir = appConfig.get('invoice.exportDir');
                  const pdfPath = path.join(exportDir, `${this.state.pdf_data._id}.pdf`);

                  const file_data = fs.readFileSync(path);
                  const file_base64_str =
                  `data:application/pdf;base64,${file_data.toString('base64')}`;

                  console.log('file_data: ', file_data);

                  const file =
                  {
                    filename: this.state.pdf_data._id,
                    content_type: 'application/pdf',
                    file: file_data.toString('base64') // file_base64_str.split('base64,').pop()
                  }

                  console.log('emailing: ', file);

                  // then: (response) =>
                  // {
                  //   if(response)
                  //   {
                  //     if(response.status == 200) // Success, successfully emailed document
                  //     {
                  //       console.log('Successfully emailed document.');
                  //       return openDialog(
                  //       {
                  //         type: 'success',
                  //         title: 'Success',
                  //         message: 'Successfully emailed document'
                  //       });
                  //     } 
                  //     console.log('Error: ' + response.status);
                  //     return openDialog(
                  //     {
                  //       type: 'danger',
                  //       title: 'Error',
                  //       message: 'Error ['+response.status+']: ' + (response.statusText || response.data)
                  //     });
                      
                  //   } 
                  //   console.log('Error: Could not get a valid response from the server.');
                  //   return openDialog(
                  //   {
                  //     type: 'danger',
                  //     title: 'Error',
                  //     message: 'Error: Could not get a valid response from the server.'
                  //   });
                    
                  // },
                  // catch: (err) =>
                  //   openDialog(
                  //   {
                  //     type: 'danger',
                  //     title: 'Error',
                  //     message: err.message
                  //   })

                  // ipc.send('email-quote', emailProps);
                  // .then((data)=>Log('info', data))
                  // .catch((err)=>Log('error', err));

                  // dispatch action to create email quote
                  // this.props.dispatch(
                  // {
                  //   type: ACTION_TYPES.QUOTE_EMAIL,
                  //   payload: this.state.new_quote
                  // });
                  
                }}
            style={{width: '120px', height: '50px', float: 'left'}}
            success
          >Create
          </Button>
        </div>
      </Wrapper>
    );
  }
}

export default Dialog;
