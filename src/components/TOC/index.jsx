import React from 'react';
import './style.scss';
import htmlTOC from 'html-toc';
import cheerio from 'cheerio';
import _ from 'lodash';

class TOC extends React.Component {
  render() {
    const content = this.props.data.markdownRemark.html;
    const $ = cheerio.load(content);
    const list = (
      <ul>

        <li>{$('h2').text()}</li>
      </ul>
    )

    return (
    <div>  {list}</div>
  )
  }

}

export default TOC;
