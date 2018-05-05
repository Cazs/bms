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

    componentDidMount()
    {
      // this.combobox.value = this.props.items[0];
      // this.updateData(this.props.items[0]);
      this.combobox.value = this.props.selected_index ? this.props.items[this.props.selected_index] : undefined;
    }
    
    focus()
    {
      this.combobox.focus();
    }
    
    updateData(value)
    {
      // this.setState({ selected_item: this.state.selected_item });
      this.props.onChange(value);
    }
    render() {
      return (
        <span>
          <select
            // defaultValue={this.state.selected}
            ref={(r)=>this.combobox = r}
            onKeyDown={this.props.onKeyDown}
            onChange={(new_item) =>
                      {
                        this.setState({ selected_item: new_item });
                        // console.log(ev.currentTarget);
                        this.updateData(new_item); // ev.currentTarget.value
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