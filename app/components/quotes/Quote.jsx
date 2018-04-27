// Libs
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';
import styled from 'styled-components';
const moment = require('moment');
const ipc = require('electron').ipcRenderer;

// Helper
import { formatNumber } from '../../../helpers/formatNumber';
import { calTermDate } from '../../../helpers/date';

// Custom Components
import Button from '../shared/Button';
import SplitButton from '../shared/SplitButton';

// Quote Container
const Wrapper = styled.div`
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  margin-bottom: 30px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

// Quote Header
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
`;

const StatusBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 6px;
  border-radius: 4px 4px 0 0;
  ${props => props.status === 'pending' && `background: #469FE5;`} ${props =>
      props.status === 'paid' && `background: #6BBB69;`} ${props =>
      props.status === 'refunded' && `background: #4F555C;`} ${props =>
      props.status === 'cancelled' && `background: #EC476E;`};
`;

const Status = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  ${props => props.status === 'pending' && `color: #469FE5;`} ${props =>
      props.status === 'paid' && `color: #6BBB69;`} ${props =>
      props.status === 'refunded' && `color: #4F555C;`} ${props =>
      props.status === 'cancelled' && `color: #EC476E;`} span {
    display: flex;
    align-items: center;
    i {
      margin-right: 5px;
    }
  }
  i.ion-checkmark {
    font-size: 16px;
    line-height: 16px;
  }
  i.ion-loop {
    font-size: 18px;
    line-height: 18px;
  }
  i.ion-backspace {
    font-size: 18px;
    line-height: 18px;
  }
  i.ion-arrow-return-left {
    font-size: 18px;
    line-height: 18px;
  }
`;

const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  i {
    margin-left: 10px;
    color: #B4B7BA;
  }
  i.ion-trash-a {
    font-size: 24px;
    line-height: 24px;
    &:hover {
      color: #EC476E;
    }
  }
  i.ion-ios-copy {
    font-size: 24px;
    line-height: 24px;
    &:hover {
      color: #469FE5;
    }
  }
}
`;

// Quote Body
const Body = styled.div`
  padding: 0 30px;
`;

// Quote Footer
const Footer = styled.div`
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > * {
    flex: 1;
    margin: 0 10px;
    &:first-child {
      flex: 3;
    }
  }
`;

// Shared Style
const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const Field = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: 15px;
  text-transform: capitalize;
  h2 {
    font-size: 21px;
    color: #283641;
    margin-bottom: 0;
    font-weight: 500;
  }
  label {
    font-size: 11px;
    color: #b4b7ba;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
    font-weight: 400;
  }
  p {
    font-weight: 300;
    margin-bottom: 0px;
    font-size: 14px;
  }
`;

// Component
class Quote extends PureComponent {
  constructor(props) {
    super(props);
    this.viewQuote = this.viewQuote.bind(this);
    this.editQuote = this.editQuote.bind(this);
    this.deleteQuote = this.deleteQuote.bind(this);
    this.duplicateQuote = this.duplicateQuote.bind(this);
    this.displayStatus = this.displayStatus.bind(this);
  }

  deleteQuote() {
    const { quote, deleteQuote } = this.props;
    deleteQuote(quote._id);
  }

  duplicateQuote() {
    const { quote, duplicateQuote } = this.props;
    duplicateQuote(quote);
  }

  editQuote() {
    const { quote, editQuote } = this.props;
    editQuote(quote);
  }

  viewQuote() {
    ipc.send('preview-quote', this.props.quote);
  }

  displayStatus() {
    const { t, quote } = this.props;
    const { status } = quote;
    const { recipient } = quote;
    switch (status) {
      case 'cancelled': {
        return (
          <span>
            <i className="ion-backspace" />
            {t('quotes:status:cancelled')}
          </span>
        );
      }
      case 'paid': {
        return (
          <span>
            <i className="ion-checkmark" />
            {t('quotes:status:paid')}
          </span>
        );
      }
      case 'refunded': {
        return (
          <span>
            <i className="ion-arrow-return-left" />
            {t('quotes:status:refunded')}
          </span>
        );
      }
      default: {
        return (
          <span>
            <i className="ion-loop" />
            {t('quotes:status:pending')}
          </span>
        );
      }
    }
  }

  renderDueDate() {
    const { t, quote } = this.props;
    const { dueDate, configs } = quote;
    const { useCustom, paymentTerm, selectedDate } = dueDate;
    const dateFormat = configs ? configs.dateFormat : this.props.dateFormat;
    // If it's a custom date then return selectedDate
    if (useCustom === true) {
      return  moment(selectedDate).format(dateFormat);
    }
    // If it's a payment term, calculate the term date and print out
    const paymentTermDate = calTermDate(quote.created_at, paymentTerm);
    return `
      ${ t(`form:fields:dueDate:paymentTerms:${paymentTerm}:label`) }
      (
      ${ moment(paymentTermDate).format(dateFormat) }
      )
    `;
  }

  render() {
    const { quote, setQuoteStatus, t } = this.props;
    const { recipient, status, configs } = quote;
    const dateFormat = quote.configs ? quote.configs.dateFormat : this.props.dateFormat;
    const statusActions = [
      {
        label: t('quotes:status:pending'),
        action: () => setQuoteStatus(quote._id, 'pending'),
      },
      {
        label: t('quotes:status:refunded'),
        action: () => setQuoteStatus(quote._id, 'refunded'),
      },
      {
        label: t('quotes:status:cancelled'),
        action: () => setQuoteStatus(quote._id, 'cancelled'),
      },
    ];
    const currencyBefore = quote.currency.placement === 'before';
    return (
      <div className="col-lg-6">
        <Wrapper>
          <StatusBar status={status} />
          <Header>
            <Status status={status}>{this.displayStatus()}</Status>
            <ButtonsGroup>
              <Button link onClick={this.duplicateQuote}>
                <i className="ion-ios-copy" />
              </Button>
              <Button link onClick={this.deleteQuote}>
                <i className="ion-trash-a" />
              </Button>
            </ButtonsGroup>
          </Header>
          <Body>
            <Row>
              <Field>
                <label>{t('quotes:fields:client')}</label>
                <h2>{recipient.fullname}</h2>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>{t('quotes:fields:quoteID')}</label>
                <p>
                  {quote.quoteID
                    ? quote.quoteID
                    : truncate(quote._id, {
                        length: 8,
                        omission: '',
                      })}
                </p>
              </Field>
              <Field>
                <label>{t('quotes:fields:total')}</label>
                <p>
                  {currencyBefore ? quote.currency.code : null}
                  {' '}
                  { formatNumber(
                      quote.grandTotal,
                      quote.currency.fraction,
                      quote.currency.separator)
                  }
                  {' '}
                  {currencyBefore ? null : quote.currency.code}
                </p>
              </Field>
            </Row>
            <Row>
              <Field>
                <label>{t('quotes:fields:createdDate')}</label>
                <p>{moment(quote.created_at).format(dateFormat)}</p>
              </Field>
              <Field>
                <label>{t('quotes:fields:dueDate')}</label>
                <p>
                  { quote.dueDate && this.renderDueDate() }
                </p>
              </Field>
            </Row>
          </Body>
          <Footer>
            <SplitButton
              mainButton={{
                label: t('quotes:btns:markAsPaid'),
                action: () => setQuoteStatus(quote._id, 'paid'),
              }}
              options={statusActions}
            />
            <Button onClick={this.editQuote}>
              {t('quotes:btns:edit')}
            </Button>
            <Button onClick={this.viewQuote}>
              {t('quotes:btns:view')}
            </Button>
          </Footer>
        </Wrapper>
      </div>
    );
  }
}

Quote.propTypes = {
  dateFormat: PropTypes.string.isRequired,
  deleteQuote: PropTypes.func.isRequired,
  duplicateQuote: PropTypes.func.isRequired,
  editQuote: PropTypes.func.isRequired,
  quote: PropTypes.object.isRequired,
  setQuoteStatus: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default Quote;
