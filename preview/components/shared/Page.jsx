import React, {Component} from 'react';

class Page extends Component
{
    constructor (props)
    {
        super(props)
        this.state =
        {
        status: 'N/A',
        page: null,
        width: 0,
        height: 0
        }
    }
    shouldComponentUpdate (nextProps, nextState, nextContext) {
        return this.context.pdf != nextContext.pdf || this.state.status !== nextState.status
    }
    componentDidUpdate (nextProps, nextState, nextContext) {
        this._update(nextContext.pdf) 
    }
    componentDidMount () {
        this._update(this.context.pdf) 
    }
    _update (pdf) {
        if (pdf) {
        this._loadPage(pdf)
        } else {
        this.setState({ status: 'loading' }) 
        }
    }
    _loadPage (pdf) {
        if (this.state.status === 'rendering' || this.state.page != null) return; 
        pdf.getPage(this.props.index).then(this._renderPage.bind(this))
        this.setState({ status: 'rendering' })
    } 
    _renderPage (page) {
        console.log(page)
        const { scale } = this.context 
        const viewport = page.getViewport(scale)
        const { width, height } = viewport
        const canvas = this.refs.canvas
        const context = canvas.getContext('2d')
        console.log(viewport.height, viewport.width)
        canvas.width = width
        canvas.height = height
        
        page.render({
        canvasContext: context,
        viewport
        })
        
        this.setState({ status: 'rendered', page, width, height })
    }
    render ()
    {
        const { width, height, status } = this.state
        return (
          <div className={`pdf-page {status}`} style={{width, height}}>
            <canvas ref='canvas' />
          </div>
        )
    }
}
  
Page.propTypes =
{
    index: React.PropTypes.number.isRequired
}

Page.contextTypes = PDF.childContextTypes