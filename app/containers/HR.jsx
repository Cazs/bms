// Libs
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { translate } from 'react-i18next';

// Components
import { Field, Part, Row } from '../components/shared/Part';
import Button from '../components/shared/Button';
import { Tab, Tabs, TabContent } from '../components/shared/Tabs';
import
{
  PageWrapper,
  PageHeader,
  PageHeaderTitle,
  PageHeaderActions,
  PageContent,
} from '../components/shared/Layout';
import _withFadeInAnimation from '../components/shared/hoc/_withFadeInAnimation';

// Tab content Components
import LeaveApplications from './HR/LeaveApplications';
import OvertimeApplications from './HR/OvertimeApplications';

// Component
class HR extends Component
{
  constructor(props)
  {
    super(props);
    this.state = { visibleTab: 'Leave' };
    this.header_actions = React.createRef();
  }

  // Switch Tab
  changeTab(tabNum)
  {
    this.setState({ visibleTab: tabNum });
  }

  // Render Main Content

  render()
  {
    const { t } = this.props;

    return (
      <PageWrapper>
        <PageHeader>
          <PageHeaderTitle>HR | {this.state.visibleTab}</PageHeaderTitle>
          <PageHeaderActions ref={this.header_actions}>
            <div style={{display: 'inline', float: 'right', marginTop: '-30px', paddingRight: '100px', borderBottom: '2px', borderColor: 'black'}}>
              <Button primary>
                New Leave Application
              </Button>
              <Button primary>
                New Overtime Application
              </Button>
            </div>
          </PageHeaderActions>
          <Tabs style={{backgroundColor: 'lime', borderTop: '2px solid black', marginTop: '30px', zIndex: '90'}}>
            <Tab
              href="#"
              className={this.state.visibleTab === 'Leave' ? 'active' : ''}
              onClick={() => this.changeTab('Leave')}
            >
              {t('Leave')}
            </Tab>
            <Tab
              href="#"
              className={this.state.visibleTab === 'Overtime' ? 'active' : ''}
              onClick={() => this.changeTab('Overtime')}
            >
              {t('Overtime')}
            </Tab>
          </Tabs>
        </PageHeader>
        <PageContent>
          
          <TabContent>
            {this.state.visibleTab === 'Leave' && (
              // <Profile t={t} />
              <LeaveApplications />
            )}
            {this.state.visibleTab === 'Overtime' && (
              <OvertimeApplications />
            )}
          </TabContent>
        </PageContent>
      </PageWrapper>
    );
  }
}

// PropTypes Validation
HR.propTypes =
{
  dispatch: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

// Map state to props & Export
const mapStateToProps = state => (
{
});

export default compose(
  connect(mapStateToProps),
  translate(),
  _withFadeInAnimation
)(HR);
