import React, {
  Component,
  Children,
  PropTypes,
  cloneElement,
} from 'react'
import { TransitionMotion, spring } from 'react-motion'

import SteackItem from './SteackItem'

class Steack extends Component {

  static propTypes = {
    reverse: PropTypes.bool,
    springConfig: PropTypes.object,
    align: PropTypes.string,
    zIndexBase: PropTypes.number,
  }

  static defaultProps = {
    reverse: false,
    align: 'right',
    zIndexBase: 0,
  }

  state = {
    heights: {},
  }

  componentWillMount () {
    this._heightCache = {}
    this._offsetCache = {}
  }

  // Collect height of a child
  //
  setHeight = key => height => {
    this._heightCache[key] = height
    this.setState({
      heights: {
        ...this._heightCache,
      },
    })
  }

  clearCacheFor = key => () => {
    delete this._heightCache[key]
  }

  render () {

    const {
      heights,
    } = this.state

    const {
      children,
      reverse,
      springConfig,
      align,
      zIndexBase,
    } = this.props

    let totalOffset = 0

    return (
      <TransitionMotion
        styles={Children.map(children, (child, i) => {

          const measured = heights[child.key] !== undefined
          const absoluteOffset = measured ? totalOffset : totalOffset - 100

          const offset = reverse
            ? -absoluteOffset
            : absoluteOffset

          if (measured) {
            this._offsetCache[child.key] = offset
          }

          const motion = {
            key: child.key,
            data: child,
            style: {
              zIndex: children.length - (zIndexBase + i),
              opacity: spring(measured ? 1 : 0),
              offset: spring(offset, springConfig),
            },
          }

          if (measured) {
            this._offsetCache[child.key] = offset
          }

          totalOffset += measured ? heights[child.key] : 0

          return motion

        })}
      >
        {motions => (
          <div
            style={{
              position: 'relative',
            }}
          >
            {motions.map((m) => {
              return (
                <SteackItem
                  key={m.key}
                  onHeightReady={this.setHeight(m.key)}
                  onWillUnmount={this.clearCacheFor(m.key)}
                  style={{
                    zIndex: m.style.zIndex,
                    transform: `translate3d(0, ${m.style.offset}px, 0)`,
                    position: 'absolute',
                    top: reverse ? 'auto' : 0,
                    bottom: reverse ? 0 : 'auto',
                    right: align === 'right' ? 0 : 'auto',
                    left: align === 'right' ? 'auto' : 0,
                  }}
                >
                  {cloneElement(m.data)}
                </SteackItem>
              )
            })}
          </div>
        )}
      </TransitionMotion>
    )
  }

}

export default Steack
