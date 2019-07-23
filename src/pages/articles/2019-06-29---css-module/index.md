---
title: '模块化编写 CSS'
date: '2019-06-29'
layout: post
draft: false
path: '/posts/css-module'
category: 'CSS'
tags:
  - CSS
description: ''
---

- Emerging problems as a project grows
- Organizing CSS into modules
- Preventing escalating selector specificity
- Surveying popular CSS methodologies

- Box sizing reset (chapter 3)
- Default font size for the page

```css
:root {
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  font-family: Helvetica, Arial, sans-serif;
}
```


<div class="message">
  Save successful
</div>

.message {                         1
  padding: 0.8em 1.2em;
  border-radius: 0.2em;
  border: 1px solid #265559;
  color: #265559;
  background-color: #e0f0f2;
}

```css
.message {                            1
  padding: 0.8em 1.2em;
  border-radius: 0.2em;
  border: 1px solid #265559;
  color: #265559;
  background-color: #e0f0f2;
}

.message--success {                   2
  color: #2f5926;
  border-color: #2f5926;
  background-color:  #cfe8c9;
}

.message--warning {                   3
  color: #594826;
  border-color: #594826;
  background-color:  #e8dec9;
}

.message--error {                     4
  color: #59262f;
  border-color: #59262f;
  background-color:  #e8c9cf;
}

<div class="message message--error">              1
  Invalid password
</div>

.button {                            1
  padding: 0.5em 0.8em;
  border: 1px solid #265559;
  border-radius: 0.2em;
  background-color: transparent;
  font-size: 1rem;
}

.button--success {                   2
  border-color: #cfe8c9;
  color: #fff;
  background-color: #2f5926;
}

.button--danger {                   3
  border-color: #e8c9c9;
  color: #fff;
  background-color: #a92323;
}

.button--small {                    4
  font-size: 0.8rem;
}

.button--large {                    5
  font-size: 1.2rem;
}
Using modifiers to create various types of buttons

<button class="button button--large">Read more</button>                 1
<button class="button button--success">Save</button>                    2
<button class="button button--danger button—small">Cancel</button>      3

```

Modules with multiple elements

```css
.media {                         1
  padding: 1.5em;
  background-color: #eee;
  border-radius: 0.5em;
}
.media::after {                  2
  content: "";
  display: block;
  clear: both;
}

.media__image {                  3
  float: left;
  margin-right: 1.5em;
}

.media__body {                   3
  overflow: auto;
  margin-top: 0;
}

.media__body > h4 {              4
  margin-top: 0;
}

<div class="media">
  <img class="media__image" src="runner.png">          1
  <div class="media__body">                            2
    <h4>Strength</h4>                                  3
    <p>
      Strength training is an important part of
      injury prevention. Focus on your core&mdash;
      especially your abs and glutes.
    </p>
  </div>
</div>

.media--right > .media__image {          1
  float: right;
}



```

