---
title: "React 最佳实践"
date: "2019-06-29"
layout: post
draft: false
path: "/posts/react-best-practice"
category: "React"
tags:
  - React
description: ""
---

## CSS in JavaScript

Block, Element, Modifier (BEM) methodology

## SyledComponent



### Inline styles


  handleChange({ target: { value } }) { 
    this.setState({ 
      value: Number(value) 
    });
  }

    render() { 
    return ( 
      <input 
        type="number" 
        value={this.state.value} 
        onChange={this.handleChange} 
        style={{ fontSize: this.state.value }} 
      /> 
    );
  }


import Radium from 'radium';
import React from 'react';
import color from 'color';

class Button extends React.Component {
  static propTypes = {
    kind: PropTypes.oneOf(['primary', 'warning']).isRequired
  };

  render() {
    // Radium extends the style attribute to accept an array. It will merge
    // the styles in order. We use this feature here to apply the primary
    // or warning styles depending on the value of the `kind` prop. Since its
    // all just JavaScript, you can use whatever logic you want to decide which
    // styles are applied (props, state, context, etc).
    return (
      <button style={[styles.base, styles[this.props.kind]]}>
        {this.props.children}
      </button>
    );
  }
}

Button = Radium(Button);

// You can create your style objects dynamically or share them for
// every instance of the component.
var styles = {
  base: {
    color: '#fff',

    // Adding interactive state couldn't be easier! Add a special key to your
    // style object (:hover, :focus, :active, or @media) with the additional rules.
    ':hover': {
      background: color('#0074d9')
        .lighten(0.2)
        .hexString()
    }
  },

  primary: {
    background: '#0074D9'
  },

  warning: {
    background: '#FF4136'
  }
};

