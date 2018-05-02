// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { setBaseFontSize } from '../helper';

// Styles
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  padding-top: 30px;
`;

const Message = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  height: 100%;
  margin: 0;
`;

const Page = styled.div`
  position: relative;
  width: 21cm;
  height: 29.7cm;
  min-height: 29.7cm;
  min-width: 21cm;
  margin-left: auto;
  margin-right: auto;
  background: #FFFFFF;
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  display: flex;
  border-radius: 4px;
`;

const PageContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.33333em;
  width: 100%;
  font-family: 'Montserrat';
  ${props =>
    props.baseFontSize &&
    `
    font-size: ${props.baseFontSize};
  `} .label, h4, th {
    font-weight: 500;
    font-size: 0.66667em;
    text-transform: uppercase;
    text-align: left;
    letter-spacing: 1px;
    color: #2c323a;
    margin: 0;
  }
  h4 {
    margin-bottom: 0.66667em;
  }
  p {
    font-weight: 300;
    font-size: 0.66667em;
    color: #2c323a;
    line-height: 1.75;
    margin: 0;
  }
  .w5 {
    width: 5%;
  }
  .w10 {
    width: 10%;
  }
  .w15 {
    width: 15%;
  }
  .w20 {
    width: 20%;
  }
`;

// Components
import QuoteTemplate from '../templates/quote/Quote';
import JobCardTemplate from '../templates/job/JobCard';
import InvoiceTemplate from '../templates/invoice/Invoice';
import PurchaseOrderTemplate from '../templates/po/PurchaseOrder';
import DocumentTemplate from '../templates/DocumentTemplate';

class MainContent extends Component
{
  renderTemplate()
  {
    if(this.props.type === 'quote')
      return <QuoteTemplate {...this.props} />;
    else if(this.props.type === 'invoice')
      return <InvoiceTemplate {...this.props} />;
    else if(this.props.type === 'po')
      return <PurchaseOrderTemplate {...this.props} />;
    else if(this.props.type === 'document')
      return <DocumentTemplate {...this.props} />;
    return <JobCardTemplate {...this.props} />;
  }

  render()
  {
    const { t, pdf_data  } = this.props;
    return (
      <Wrapper>
        {(
          <div className="print-area">
            <div style={
              {
                width: '80%',
                height: '110px',
                marginLeft: 'auto',
                marginRight: 'auto',
                backgroundColor: '#A183E8',
                background: 'url(../static/images/header.jpg)', // TODO: custom headers
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}
            />
            <Page style={{marginTop: '-20px'}}>
              <PageContent baseFontSize={setBaseFontSize(this.props.configs.fontSize)}>
                {this.renderTemplate()}
              </PageContent>
            </Page>
          </div>
        )}
      </Wrapper>
    );
  }
}

MainContent.propTypes =
{
  configs: PropTypes.object.isRequired,
  pdf_data: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default MainContent;
