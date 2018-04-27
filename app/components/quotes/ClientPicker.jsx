import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ClientPicker extends React.Component {
    constructor(props)
    {
      super(props);
      this.updateData = this.updateData.bind(this);
      this.state = 
        { 
          amount: 0,// props.defaultValue.amount,
          selected_client: undefined
        };
    }
    focus() {
      this.inputRef.focus();
    }
    updateData() {
        alert('updating data');
      this.props.onUpdate({ selected_client: this.state.selected_client });
    }
    render() {
      return (
        <span>
          <select
            value={this.props.selected_client._id}
            onKeyDown={this.props.onKeyDown}
            onChange={(ev) =>
                      {
                        this.setState({ selected_client: ev.currentTarget.value });
                        this.updateData();
                      }}
          >
            { this.props.clients.map(client => (<option key={client._id} value={client._id}>{ client.client_name }</option>)) }
          </select>
        </span>
      );
    }
  }

  ClientPicker.propTypes = {
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    selected_client: PropTypes.object.isRequired
  };

  export default ClientPicker;