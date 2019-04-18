import React from 'react';
import Link from 'gatsby-link';
import moment from 'moment';
import Disqus from '../Disqus/Disqus';
import TOC from '../TOC/index';
import './style.scss';


function tableOfContentsGenerator(content, params) {
  var bbCode='', containerClass = 'toc', titleClass = 'toc-title', title = 'Table of Content';
  /**
   * If we specify BBCode but it wasn't find in text – just return content earlier.
   */
  if (bbCode && content.indexOf(bbCode) === -1) {
    return content
  }

  /**
   * State
   */
  var level = 1 // Must be 1 for correct work and valid HTML 5.
  var anchorId = 1
  var toc = ''
  var output = ''

  // Works only for plain H tags without classes, ids etc.
  var regexp = /<h([\d])>([^<]+)<\/h([\d])>/gi
  
  content = 
    content.replace(regexp, function(str, openLevel, titleText, closeLevel) {
      if (openLevel != closeLevel) {
          return str
      }

      if (openLevel > level) {
        toc += (new Array(openLevel - level + 1)).join("<ul>")
      } else if (openLevel < level) {
        toc += (new Array(level - openLevel + 1)).join("</ul>")
      }

      level = parseInt(openLevel)

      var anchor = 'toc' + anchorId++

      toc += "<li><a href=\"#" + anchor + "\">" + titleText + "</a>";

      return "<h" + openLevel + " id=\"" + anchor + "\">" + titleText + "</h" + closeLevel + ">";
    }
  )

  if (level > 1) {
    toc += (new Array(level + 1)).join('</ul>')
  }

  output += toc;
  
  /**
   * If we find headers - paste TOC to the content.
   */
  if (output) {
    var wrappedToc = "<div class=\"" + containerClass + "\"><div class=\"" + titleClass + "\">" + title + "</div>" + output + "</div>";

    /**
     * If we specify BBCode, replace it with TOC. If not – add TOC to beginning of content.
     */
    content = bbCode ? content.replace(bbCode, wrappedToc) : wrappedToc + content
  }
  
  return content 
}

class PostTemplateDetails extends React.Component {

  
  render() {
    const { subtitle, author } = this.props.data.site.siteMetadata;
    const post = this.props.data.markdownRemark;
    var toc = tableOfContentsGenerator(post.html)
    const tags = post.fields.tagSlugs;
   
    const homeBlock = (
      <div>
        <Link className="post-single__home-button" to="/">All Articles</Link>
      </div>
      
    );

    const tagsBlock = (
      <div className="post-single__tags">
        <ul className="post-single__tags-list">
          {tags && tags.map((tag, i) => (
            <li className="post-single__tags-list-item" key={tag}>
              <Link to={tag} className="post-single__tags-list-item-link">
                {post.frontmatter.tags[i]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );

    const commentsBlock = (
      <div>
        <Disqus postNode={post} siteMetadata={this.props.data.site.siteMetadata} />
      </div>
    );

    const tocBlock = (
      <div>
        <TOC {...this.props}/>
      </div>
    );

    return (
      <div>
        {homeBlock}
        {tocBlock}
        <div className="post-single">
          <div className="post-single__inner">
            <h1 className="post-single__title">{post.frontmatter.title}</h1>
            <div className="date-center">Published {moment(post.frontmatter.date).format('D MMM YYYY')}</div>
            <div className="post-single__body" dangerouslySetInnerHTML={{ __html: toc }} />
            <div className="post-single__date">

            </div>
          </div>
          <div className="post-single__footer">
            {tagsBlock}
             {/*<hr />*/}
            <p className="post-single__footer-text">
            {/*
              {subtitle}
              <a href={`https://twitter.com/${author.twitter}`} target="_blank" rel="noopener noreferrer">
                <br /> <strong>{author.name}</strong> on Twitter
              </a>
              */}
            </p>
            {commentsBlock}
          </div>
        </div>
      </div>
    );
  }
}

export default PostTemplateDetails;
