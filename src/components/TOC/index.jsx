import React from 'react';
import './style.scss';

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
