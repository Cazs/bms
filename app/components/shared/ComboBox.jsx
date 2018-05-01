import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ComboBox extends React.Component
{
    constructor(props)
    {
      super(props);
      this.updateData = this.updateData.bind(this);
      this.state = 
        { 
          selected_item: props.defaultValue
        };
    }
    
    focus() {
      this.inputRef.focus();
    }
    updateData(value) {
      // this.props.onUpdate({ selected_item: this.state.selected_item });
      this.props.onUpdate(value);
    }
    render() {
      return (
        <span>
          <select
            // defaultValue={this.state.selected}
            onKeyDown={this.props.onKeyDown}
            onChange={(ev) =>
                      {
                        this.setState({ selected_item: ev.currentTarget.value });
                        // console.log(ev.currentTarget);
                        this.updateData(ev.currentTarget.value);
                      }}
          >
            {
              this.props.items ? 
              this.props.items.map((item, index) =>
                (<option key={index} value={JSON.stringify(item)} selected={index == this.props.selected_index}>{item[this.props.label] }</option>)) :
              (<option />)
            }
          </select>
        </span>
      );
    }
  }

  ComboBox.propTypes =
  {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    // selected_item: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired
  };

  export default ComboBox;