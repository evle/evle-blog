import React from 'react';
import './style.scss';

import _ from 'lodash';
// var toc = require('html-toc');
const makeToc = require('table-of-contents-generator')
 
const content = `
  <p>Long long long text</p>
  [TOC]
  <h2>Some title</h2>
  <p>Long long long text</p>
  <h2>Other Title</h2>
  <p>Long long long text</p>
  <p>Long long long text</p>
  <h3>Sub title 1</h3>
  <p>Long long long text</p>
  <h3>Sub title 2</h3>
  <p>Long long long text</p>
  <h2>Title</h2>
  <p>Long long long text</p>
`
 

class TOC extends React.Component {
  

  
  render(){
    var post = this.props.data.markdownRemark;
  
    // var toc = makeToc(post.html)
    // toc(post.html, {selectors: 'h1,h2,h3,h4'});
    return (
      <div ></div>
    )

  }

}

export default TOC;
