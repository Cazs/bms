import React, {Component} from 'react';
import * as PDFJS from 'pdfjs';

class PDF extends Component
{
    constructor (props)
    {
      super(props)
      this.state =
      {
        pdf: null,
        scale: 1.2
      }
    }
    getChildContext ()
    {
      return {
        pdf: this.state.pdf,
        scale: this.state.scale
      }
    }
    componentDidMount ()
    {
      PDFJS.getDocument(this.props.src).then((pdf) =>
      {
        console.log(pdf)
        this.setState({ pdf })
      })
    }
    render ()
    {
      return (<div className='pdf-context'>{this.props.children}</div>) 
    }
  }
  
PDF.propTypes =
{
  src: React.PropTypes.string.isRequired
}
  
export const childContextTypes =
{
  pdf: React.PropTypes.object,
  scale: React.PropTypes.number
}