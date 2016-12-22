import React, { Component } from 'react'

function getHeight (node) {
  return node.getBoundingClientRect().height
}

class SteackItem extends Component {

  componentDidMount () {
    const height = getHeight(this._node)
    this.props.onHeightReady(height)
  }

  componentWillUnmount () {
    this.props.onWillUnmount()
  }

  render () {

    const {
      children,
      style,
    } = this.props

    return (
      <div
        ref={node => this._node = node}
        style={style}
      >
        {children}
      </div>
    )
  }

}

export default SteackItem
