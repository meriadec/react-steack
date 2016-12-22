import React, { Component } from 'react'
import { render } from 'react-dom'
import random from 'lodash/random'
import { generate } from 'shortid'

import Steack from '../src/Steack'

class App extends Component {

  state = {
    items: [],
    reverse: false,
    align: 'right',
    bounce: false,
  }

  addItem = (direction = 'before') => () => {

    const {
      items,
    } = this.state

    const newItem = {
      // unique key for map items (don't use array index)
      id: generate(),
      // arbitrary set a height to item, for demo purpose
      height: 20 + (random(0, 10) * 10),
    }

    const middle = items.length >= 2
      ? Math.round(items.length / 2)
      : 0

    const newItems = direction === 'before'
      ? [newItem, ...items]
      : (direction === 'after'
        ? [...items, newItem]
        : [
          ...items.slice(0, middle),
          newItem,
          ...items.slice(middle),
        ]
      )

    this.setState({ items: newItems })

  }

  removeItem = (item) => () => this.setState({
    items: this.state.items.filter(it => it !== item),
  })

  toggleReverse = () => this.setState({
    reverse: !this.state.reverse,
  })

  toggleBounce = () => this.setState({
    bounce: !this.state.bounce,
  })

  toggleAlign = () => this.setState({
    align: this.state.align === 'right' ? 'left' : 'right',
  })

  render () {

    const {
      items,
      reverse,
      bounce,
      align,
    } = this.state

    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >

        <p>
          <button onClick={this.addItem('before')}>
            {'add before'}
          </button>
          <button disabled={items.length < 2} onClick={this.addItem('middle')}>
            {'add middle'}
          </button>
          <button onClick={this.addItem('after')}>
            {'add after'}
          </button>
        </p>

        <p>
          <button
            onClick={this.removeItem(items[0])}
            disabled={!items.length}
          >
            {'remove first'}
          </button>
          <button
            onClick={this.removeItem(items[items.length - 1])}
            disabled={!items.length}
          >
            {'remove last'}
          </button>
        </p>

        <p>

          <label style={{ background: reverse ? 'cyan' : 'transparent' }}>
            <input
              type='checkbox'
              checked={reverse}
              onChange={this.toggleReverse}
            />
            {'reverse'}
          </label>

          {' - '}

          <label style={{ background: bounce ? 'cyan' : 'transparent' }}>
            <input
              type='checkbox'
              checked={bounce}
              onChange={this.toggleBounce}
            />
            {'bounce'}
          </label>

        </p>

        <p>

          <label>
            <input
              type='checkbox'
              checked={align === 'right'}
              onChange={this.toggleAlign}
            />
            {`align ${align}`}
          </label>

        </p>

        <span
          style={{
            background: 'yellow',
            opacity: items.length ? 1 : 0,
          }}
        >
          {'HINT: you can remove item by clicking on it'}
        </span>

        <div
          style={{
            position: 'fixed',
            bottom: reverse ? 20 : 'auto',
            top: reverse ? 'auto' : 20,
            right: align === 'right' ? 20 : 'auto',
            left: align === 'right' ? 'auto' : 20,
            width: 400,
          }}
        >
          <Steack
            reverse={reverse}
            align={align}
            springConfig={bounce ? { stiffness: 250, damping: 17 } : undefined}
          >
            {items.map(item => (
              <div
                key={item.id}
                onClick={this.removeItem(item)}
                style={{
                  background: '#ccc',
                  border: '1px solid #aaa',
                  height: item.height,
                  width: item.height * 3,
                  marginTop: reverse ? 20 : 0,
                  marginBottom: reverse ? 0 : 20,
                  cursor: 'pointer',
                  boxShadow: 'rgba(0, 0, 0, 0.3) 0 4px 12px',
                }}
               />
            ))}
          </Steack>
        </div>

      </div>
    )
  }

}

render(<App />, document.getElementById('root'))
