---
title: "Build with React"
date: "2018-03-17"
layout: post
draft: false
path: "/posts/Build-with-React"
category: ""
tags:
  - "React.js"
description: ""
---



使用react
加载cdn react react-dom
<div id="app"></div>

ReactDOM.render(
  <div>Hello</div>, // 内容
  document.getElementById('app'); // 挂载
);
1. ReactDOM.render方法 将模版转换为HTML并挂载到指定DOM节点
2. JSX  < 开头解析为HTML { 开头解析为JS  HTML JS混写
3. 组件
组件是React的核心思想之一， 将代码封装成一个个组件，像插入HTML一样在网页中插入
React.createClass用于生成一个组建类

var HelloMessage = React.createClass({ //大写
  render: function(){  // React.createClass方法需要有一个render方法 返回组件显示的内容
    return <h1>Hello {this.props.name}</h1> // 组件只能包含一个顶层标签
  }
  })

ReactDOM.render(
  <HelloMessage name="John" />, 挂载react Component
  document.getElementById('app');
  )

组件的class是 className / for 是 htmlFor

4. this.props.children
this.props对象的属性与组件的属性一一对应
除了this.props.children属性之外 该属性表示组件的所有子节点

var NoteList = React.createClass({
  render: function(){
    return (
      <ol>
      {// 比你React.Children.map
          React.Children.map(this.props.children, child => <li>{child}</li>)
      }
      </ol>
      )
  }
  })

ReactDOM.render(
  <NoteList>
    <span>todo1</span>
    <span>todo2</span>
    <span>todo3</span>
    </NoteList>,
doucment.body
  )

this.props.children
没有子节点 undefined
有一个子节点 object
多个子节点 array

6. PropTypes
验证参数的

var MyTitle = React.createClass({
  propTypes:{
    title: React.PropTypes.string.isRequied,
  }
  render: function(){
    return <h1> {this.props.title}</h1>
  }

  })
7.设置默认值
var MyTitle = React.createClass){
  getDefaultProps: function(){
    return {
      title: 'Hello World'
    };
  }
  render: function(){
    return <h1>{this.props.title}</h1>;
  }
});

ReactDOM.render(
  <MyTitle />,
  document.body
  );

8.获取真实DOM节点
从真实节点获取DOM的时候 使用ref

var MyComponent = React.createClass({
  handleClick: function() {
    // this.refs.[refName] 返回真实DOM节点
    this.refs.myTextInput.focus();
  },
  render: function() {
    return (
      <div>
        <input type="text" ref="myTextInput" />
        <input type="button" value="Focus the text input" onClick={this.handleClick} />
      </div>
    );
  }
});

ReactDOM.render(
  <MyComponent />,
  document.getElementById('example')
);


10. this.state
state改变则刷新UI
var LikeButton = React.createClass({
  getInitialState: function() {
    return {liked: false};
  },
  handleClick: function(event) {
    this.setState({liked: !this.state.liked});
  },
  render: function() {
    var text = this.state.liked ? 'like' : 'haven\'t liked';
    return (
      // 通过用户点击 改变 state  state改变自动调用this.render UI改变
      <p onClick={this.handleClick}>
        You {text} this. Click to toggle.
      </p>
    );
  }
});

ReactDOM.render(
  <LikeButton />,
  document.getElementById('example')
);

11. 表单

var Input = React.createClass({
  // 设置初始state
  getInitialState: function() {
    return {value: 'Hello!'};
  },
  handleChange: function(event) {
    // 获取用户输入值
    this.setState({value: event.target.value});
  },
  render: function () {
    var value = this.state.value;
    return (
      <div>
      // 绑定输入改变事件
        <input type="text" value={value} onChange={this.handleChange} />
        <p>{value}</p>
      </div>
    );
  }
});
// input textarea select radio
ReactDOM.render(<Input/>, document.body);

12组件的生命周期
Mounting: 已插入真实DOM
Updating: 正在被重新渲染
Unmounting: 已卸载真实DOM

componentWillMount()
componentDidMount()
componentWillUpdate(object nextProps, object nextState)
componentDidUpdate(object prevProps, object prevState)
componentWillUnmount()

还有2种特殊
componentWillReceiveProps(object nextProps)：已加载组件收到新的参数时调用
shouldComponentUpdate(object nextProps, object nextState)：组件判断是否重新渲染时调用

var Hello = React.createClass({
  getInitialState: function () {
    return {
      opacity: 1.0
    };
  },

  componentDidMount: function () {
    this.timer = setInterval(function () {
      var opacity = this.state.opacity;
      opacity -= .05;
      if (opacity < 0.1) {
        opacity = 1.0;
      }
      this.setState({
        opacity: opacity
      });
    }.bind(this), 100);
  },

  render: function () {
    return (
      //注意这个写法
      <div style={{opacity: this.state.opacity}}>
        Hello {this.props.name}
      </div>
    );
  }
});

ReactDOM.render(
  <Hello name="world"/>,
  document.body
);


Ajax 组件数据的来源
可以使用 componentDidMount 方法设置 Ajax 请求，等到请求成功，再用 this.setState 方法重新渲染 UI

var UserGist = React.createClass({
  getInitialState: function() {
    return {
      username: '',
      lastGistUrl: ''
    };
  },

  componentDidMount: function() {
    $.get(this.props.source, function(result) {
      var lastGist = result[0];
      if (this.isMounted()) {
        this.setState({
          username: lastGist.owner.login,
          lastGistUrl: lastGist.html_url
        });
      }
    }.bind(this));
  },

  render: function() {
    return (
      <div>
        {this.state.username}'s last gist is
        <a href={this.state.lastGistUrl}>here</a>.
      </div>
    );
  }
});

ReactDOM.render(
  <UserGist source="https://api.github.com/users/octocat/gists" />,
  document.body
);

使用promise代替

ReactDOM.render(
  <RepoList
    promise={$.getJSON('https://api.github.com/search/repositories?q=javascript&sort=stars')}
  />,
  document.body
);
上面代码从Github的API抓取数据，然后将Promise对象作为属性，传给RepoList组件。

如果Promise对象正在抓取数据（pending状态），组件显示"正在加载"；如果Promise对象报错（rejected状态），组件显示报错信息；如果Promise对象抓取数据成功（fulfilled状态），组件显示获取的数据。


var RepoList = React.createClass({
  getInitialState: function() {
    return { loading: true, error: null, data: null};
  },

  componentDidMount() {
    this.props.promise.then(
      value => this.setState({loading: false, data: value}),
      error => this.setState({loading: false, error: error}));
  },

  render: function() {
    if (this.state.loading) {
      return <span>Loading...</span>;
    }
    else if (this.state.error !== null) {
      return <span>Error: {this.state.error.message}</span>;
    }
    else {
      var repos = this.state.data.items;
      var repoList = repos.map(function (repo) {
        return (
          <li>
            <a href={repo.html_url}>{repo.name}</a> ({repo.stargazers_count} stars) <br/> {repo.description}
          </li>
        );
      });
      return (
        <main>
          <h1>Most Popular JavaScript Projects in Github</h1>
          <ol>{repoList}</ol>
        </main>
      );
    }
  }
});
