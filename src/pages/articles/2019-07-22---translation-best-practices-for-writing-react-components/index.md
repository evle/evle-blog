---
title: "编写React组件的最佳实践(翻译)"
date: "2019-07-22"
layout: post
draft: false
path: "/posts/translation-best-practices-for-writing-react-components"
category: "React"
tags:
  - 
description: ""
---

众知React应用是一种基于组件的架构模式, 复杂的UI可以通过一些小的组件组合起来, 站在软件工程的角度这样的开发方式会提高开发效率, 程序的健壮性和可维护性。

但在实际组件的编写中我们通常会遇到一个问题: 复杂的组件往往具有多种职责, 并且组件之间的耦合性很高, 我们越写越复杂的组件会产生技术负债, 恐惧每一次需求的变化, 在后期维护上花费很高的时间和精力成本。

那么为了解决这个问题, 我们需要思考以下2个问题:

- 复杂组件如何拆分？
- 组件之间如何通信会降低他们的耦合性或者说依赖？

## Single responsibility 原则

> A component has a single responsibility when it has one reason to change.

Single responsibility principle (SRP) 要求一个组件只做一件事情, 单一任务, 良好的可测试性, 是编写复杂组件的基础。这样当我们需求变化时候, 我们也只需要修改单一的组件, 不会出现连锁反应造成的"开发信心缺失"。

举个实际的例子: 获取远程数据组件, 先分析出该组件中可能变化的点

- 请求地址
- 响应的数据格式
- 使用不同的HTTP库
- 等等

再举个例子: 表格组件, 拿到设计图看到设计图上有4行3列的数据, 直接写死4行3列是没有智慧的, 我们还是先要考虑可能变化的点:

- 增加行列或者减少行列
- 空的表格如何显示
- 请求到的表格数据格式发生变化

有些人会觉得是不是想太多? 很多时候人们通常会忽视SRP, 起初看来确实写在一起也没有糟更重要的原因是因为写的快, 因为不需要去思考组件结构和通信之类的事情, 但是在产品需求变化频繁的今天, 唯有良好的组件化设计才能保障产品迭代的速度与质量。 

### 实践: 拆分一个Weather组件

```javascript
import axios from 'axios';
class Weather extends Component {
   constructor(props) {
     super(props);
     this.state = { temperature: 'N/A', windSpeed: 'N/A' };
   }
 
   render() {
     const { temperature, windSpeed } = this.state;
     return (
       <div className="weather">
         <div>Temperature: {temperature}°C</div>
         <div>Wind: {windSpeed}km/h</div>
       </div>
     );
   }
   
   componentDidMount() {
     axios.get('http://weather.com/api').then(function(response) {
       const { current } = response.data; 
       this.setState({
         temperature: current.temperature,
         windSpeed: current.windSpeed
       })
     });
   }
}
```

明显这个组件的设计违反了SRP, 先让我们分析一下`Weather`组件中有哪些会变化的点:

- 网络请求部分可能会变, 比如服务器地址, 响应的数据格式
- UI展示的逻辑可能会变, 有可能以后要增加其他天气信息

为了拥抱以上的变化我们可以将`Weather`拆分成2个组件: `WeatherFetch`和`WeatherInfo`, 分别用来处理网络请求和UI信息的展示。

拆分为的组件应该是这样的

```javascript
// Weather
class Weather extends Component {
   render() {
     return <WeatherFetch />;
   }
}

// WeatherFetch
class WeatherFetch extends Component {
   constructor(props) {
     super(props);
     this.state = { temperature: 'N/A', windSpeed: 'N/A' };
   }
 
    render() {
         const { temperature, windSpeed } = this.state;
         return (
           <WeatherInfo temperature={temperature} windSpeed={windSpeed} />
         );
    }
   
   componentDidMount() {
     axios.get('http://weather.com/api').then(function(response) {
       const { current } = response.data; 
       this.setState({
         temperature: current.temperature,
         windSpeed: current.windSpeed
       });
     });
   }
}

// WeatherInfo
function WeatherInfo({ temperature, windSpeed }) {
   return (
     <div className="weather">
       <div>Temperature: {temperature}°C</div>
       <div>Wind: {windSpeed} km/h</div>
     </div>
   );
}
```

### HOC的应用

> Higher order component is a function that takes one component and returns a new component. 

有些时候拆分组件也不一定是万能的, 比如想给一个组件上额外添加一些参数。 这时我们可使用高阶组件(HOC)

HOC最经典的使用场景是 **props proxy** , 即包裹一个组, 为其添加props或者修改已经存在的props, 并返回一个新组件。

```javascript
function withNewFunctionality(WrappedComponent) {
  return class NewFunctionality extends Component {
    render() {
      const newProp = 'Value';
      const propsProxy = {
         ...this.props,
         // Alter existing prop:
         ownProp: this.props.ownProp + ' was modified',
         // Add new prop:
         newProp
      };
      return <WrappedComponent {...propsProxy} />;
    }
  }
}
const MyNewComponent = withNewFunctionality(MyComponent);
```

#### Props proxy

写一个最基础的表单, 一个`input`, 一个`button`

![](https://user-gold-cdn.xitu.io/2019/11/19/16e830dbcf0813d0?w=632&h=173&f=png&s=6709)

```javascript
class PersistentForm extends Component {  
  constructor(props) {
    super(props);
    this.state = { inputValue: localStorage.getItem('inputValue') };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { inputValue } = this.state;
    return (
      <div className="persistent-form">
        <input type="text" value={inputValue} 
          onChange={this.handleChange}/> 
        <button onClick={this.handleClick}>Save to storage</button>
      </div>
    );
  }

  handleChange(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  handleClick() {
    localStorage.setItem('inputValue', this.state.inputValue);
  }
}
```

我们现在应该能本能的感觉出上面的代码哪里有问题, 这个组件做了2件事情违反了SRP: `input`的点击事件将用户输入的内容存储到state, `button`的点击事件将state存储到`localStorage`, 现在让我们拆分这两件事情。

```javascript
class PersistentForm extends Component {  
  constructor(props) {
    super(props);
    this.state = { inputValue: props.initialValue };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { inputValue } = this.state;
    return (
      <div className="persistent-form">
        <input type="text" value={inputValue} 
          onChange={this.handleChange}/> 
        <button onClick={this.handleClick}>Save to storage</button>
      </div>
    );
  }

  handleChange(event) {
    this.setState({
      inputValue: event.target.value
    });
  }

  handleClick() {
    this.props.saveValue(this.state.inputValue);
  }
}
```

改成这样的话我们需要一个父组件来提供存储到localStorage的功能, 这时候HOC就派上用场了, 我们通过HOC为刚才的组件添加存储到localStorage的功能。

```javascript
function withPersistence(storageKey, storage) {
  return function(WrappedComponent) {
    return class PersistentComponent extends Component {
      constructor(props) {
        super(props);
        this.state = { initialValue: storage.getItem(storageKey) };
      }

      render() {
         return (
           <WrappedComponent
             initialValue={this.state.initialValue}
             saveValue={this.saveValue}
             {...this.props}
           />
         );
      }

      saveValue(value) {
        storage.setItem(storageKey, value);
      }
    }
  }
}
```

最后把他们变为一个组件, 搞定！

```
const LocalStoragePersistentForm 
  = withPersistence('key', localStorage)(PersistentForm);

const instance = <LocalStoragePersistentForm />;
```

通过HOC添加的localStora存储功能复用起来无比的方便, 比如现在有另一个表单需要使用localStorage存储功能, 我们只需要修改传递参数即可

```javascript
const LocalStorageMyOtherForm
  = withPersistence('key', localStorage)(MyOtherForm);

const instance = <LocalStorageMyOtherForm />;
```

#### Render highjacking

除了 **props proxy** 之外, HOC还有一个经典应用场景是 **render highjacking**

```javascript
function withModifiedChildren(WrappedComponent) {
  return class ModifiedChildren extends WrappedComponent {
    render() {
      const rootElement = super.render();
      const newChildren = [
        ...rootElement.props.children, 
        // Insert a new child:
        <div>New child</div>
      ];
      return cloneElement(
        rootElement, 
        rootElement.props, 
        newChildren
      );
    }
  }
}
const MyNewComponent = withModifiedChildren(MyComponent);
```

和 **props proxy** 不同的是, **render highjacking** 可以在不 **入侵** 原组件的情况下, 修改其UI渲染。 
## Encapsulated 封装

> An encapsulated component provides props to control its behavior while not exposing its internal structure. 

Coupling (耦合) 是软件工程中不得不考虑的问题之一, 如何解耦或者降低耦合也是软件开发工程师遇到的难题。

![](https://user-gold-cdn.xitu.io/2019/11/19/16e82f2c4b5b365a?w=900&h=1080&f=png&s=400432)

低耦合如上图, 当你需要修改系统的一个部分时可能只会影响一小部分其他系统, 而下面这种高耦合是让开发人员对软件质量失去信心的原罪, 改一处可能瞬间爆炸。

![](https://user-gold-cdn.xitu.io/2019/11/19/16e82f4a106e7895?w=900&h=1080&f=png&s=389555)

### 隐藏信息

一个组件可能要操作`refs`, 可能有`state`, 可能使用了生命周期方法, 这些具体的实现细节其他组件是不应该知道的, 即: 组件之间需要隐藏实现细节, 这也是组件拆分的标准之一。

### 通信

组件拆分后, 原来直接获取的数据, 现在就要依靠通信来获取, 虽然更加繁琐, 但是在可读性和维护性上带来的好处远远大于它的复杂性的。React组件之间通信的主要手段是:props

```javascript
// 使用props通信
<Message text="Hello world!" modal={false} />;

// 当然也可以传递复杂数据
<MoviesList items={['Batman Begins', 'Blade Runner']} />
<input type="text" onChange={handleChange} />

// 当然也可以直接传递组件(ReactNode)
function If({ component: Component, condition }) {
  return condition ? <Component /> : null;
}
<If condition={false} component={LazyComponent} />  

```

## Composable 组合

> A composable component is created from the composition of smaller specialized components. 

Medium上有一篇文章叫做 组合是React的心脏 (Composition is the heart of React), 因为它发挥了以下3个优点:

- 单一责任
- 复用性
- 灵活性

接下来举🌰说明

### 单一责任

```javascript
const app = (
  <Application>
    <Header />
    <Sidebar>
      <Menu />
    </Sidebar>
    <Content>
      <Article />
    </Content>
    <Footer />
  </Application>
);
```

`app`这个组件中的每个组件都只负责它该负责的部分, 比如`Application`只是一个应用的容器, `<Footer />`负责渲染页面底部的信息, 页面结构一目了然。

### 复用性

提取出不同组件中的相同代码是提升维护性的最佳实践, 比如

```javascript
const instance1 = (
  <Composed1>
    <Piece1 />
    <Common />
  </Composed1>
);
const instance2 = (
  <Composed2>
    <Common />
    <Piece2 />
  </Composed2>
);
```

### 灵活性

组合的特性可以让编写React代码时候非常灵活, 当组件组合时需要通过props进行通信, 比如 父组件可以通过`children` prop 来接收子组件。

当我们想为移动和PC展示不同的UI时我们通常会写成以下这样:

```javascript
render(){
    return (<div>
        {Utils.isMobile() ? <div>Mobile detected!</div> : <div>Not a mobile device</div>}
    </div>) 
}
```

At first glance, it harmeless, 但是它明显将判断是否时移动端的逻辑与组件耦合了。这不是在拼积木, 这是在"入侵"积木！

让我们拆分判断逻辑与UI试图, 并且看看React如何使用 **children prop** 灵活的进行数据通信。

```javascript
function ByDevice({ children: { mobile, other } }) {
  return Utils.isMobile() ? mobile : other;
}

<ByDevice>{{
  mobile: <div>Mobile detected!</div>,
  other:  <div>Not a mobile device</div>
}}</ByDevice>
```

## Reusable 复用

> A reusable component is written once but used multiple times.

软件世界经常犯的错误就是 reinventing the wheel (造轮子), 比如在项目中编写了已经存在的工具或者库, React组件也是一样的, 我们要考虑代码的复用性, 尽可能的降低重复的代码和造轮子的事情发生, 是我们代码"写一次, 可以使用很多次"。 

> Reuse of a component actually means the reuse of its responsibility implementation. 

在这里可以找到很多高质量的React组件, 避免我们造轮子: [Absolutely Awesome React Components & Libraries](https://github.com/brillout/awesome-react-components)

通过阅读上面这些可复用的高质量React组件的源码我们会收获到更多复用的思想以及一些API的使用技巧比如：`React.cloneElement`等等。

## Pure Component

Pure Component是从函数式编程延伸出来的概念, pure function always returns the same output for given the same input. 比如

const sum= (a, b) => a + b // sum(1, 1) // => 2

给相同的参数永远会得到相同的结果, 当一个函数内部使用全局变量的话那么那个函数可能会变得不那么"纯"(impure)。

```javascript
let said = false;

function sayOnce(message) {
  if (said) {
    return null;
  }
  said = true;
  return message;
}

sayOnce('Hello World!'); // => 'Hello World!'
sayOnce('Hello World!'); // => null
```

impure函数就是给定相同的参数确有可能得到不同的结果, 那么组件也是一个道理, pure component组件会让我们对自己的组件质量充满信心, 但是不可能所有的组件我们都可以写成 pure component. 比如我们的组件里面有一个`<Input />`, 那么我们的组件不接受任何参数, 但是每次都可能产生不一样的结果。 

真实世界中太多impure的事情, 比如全局状态, 可改变的全局状态害人不浅, 数据被意外改变导致意外的行为, 如果实在要使用全局状态, 那么考虑使用Redux吧。除了全局状态导致impure的东西还有很多比如网络请求, local storage等等, 那如何让我们的组件尽可能的变成pure component呢？ 

答案： purification

![](https://user-gold-cdn.xitu.io/2019/11/19/16e82571acc2b40a?w=900&h=1037&f=png&s=413614)

下面让我们实践一下如何将impure中pure的部分过滤出来, 成为一个almost pure组件, 用前面获取天气的那个例子, 我们把网络请求这种impure的东西使用`redux-saga`过滤出来

这是之前的代码:
```javascript
class WeatherFetch extends Component {  
   constructor(props) {
     super(props);
     this.state = { temperature: 'N/A', windSpeed: 'N/A' };
   }

   render() {
     const { temperature, windSpeed } = this.state;
     return (
       <WeatherInfo temperature={temperature} windSpeed={windSpeed} />
     );
   }

   componentDidMount() {
     axios.get('http://weather.com/api').then(function(response) {
       const { current } = response.data; 
       this.setState({
         temperature: current.temperature,
         windSpeed: current.windSpeed
       })
     });
   }
}
```

改造后

```javascript
// 定义action
export function fetch() {
  return {
    type: 'FETCH'
  };
}

// 定义dispatch handler
import { call, put, takeEvery } from 'redux-saga/effects';

export default function* () {
  yield takeEvery('FETCH', function* () {
    const response = yield call(axios.get, 'http://weather.com/api');
    const { temperature, windSpeed } = response.data.current;
    yield put({
      type: 'FETCH_SUCCESS',
      temperature,
      windSpeed
    });
  });
}

// 定义reducer 
const initialState = { temperature: 'N/A', windSpeed: 'N/A' };

export default function(state = initialState, action) {
  switch (action.type) {
    case 'FETCH_SUCCESS': 
      return {
        ...state,
        temperature: action.temperature,
        windSpeed: action.windSpeed
      };
    default:
      return state;
  }
}

// 使用redux连接起来
import { connect } from 'react-redux';
import { fetch } from './action';

export class WeatherFetch extends Component {
   render() {
     const { temperature, windSpeed } = this.props;
     return (
       <WeatherInfo temperature={temperature} windSpeed={windSpeed} />
     );
   }

   componentDidMount() {
     this.props.fetch();
   }
}

function mapStateToProps(state) {
  return {
    temperature: state.temperate,
    windSpeed: state.windSpeed
  };
}
export default connect(mapStateToProps, { fetch });
```

将impure的组件改成almost pure的组件可以让我们更了解程序的行为, 也将变得更易于测试

```javascript
import assert from 'assert';
import { shallow, mount } from 'enzyme';
import { spy } from 'sinon';
// Import the almost-pure version WeatherFetch
import { WeatherFetch } from './WeatherFetch';
import WeatherInfo from './WeatherInfo';

describe('<WeatherFetch />', function() {
  it('should render the weather info', function() {
    function noop() {}
    const wrapper = shallow(
      <WeatherFetch temperature="30" windSpeed="10" fetch={noop} />
    );
    assert(wrapper.contains(
      <WeatherInfo temperature="30" windSpeed="10" />
    ));
  });

  it('should fetch weather when mounted', function() {
    const fetchSpy = spy();
    const wrapper = mount(
     <WeatherFetch temperature="30" windSpeed="10" fetch={fetchSpy}/>
    );
    assert(fetchSpy.calledOnce);
  });
});
```

其实上面的almost pure组件仍然有优化的空间, 我们可以借助一些工具库让它成为pure component

```javascript
import { connect } from 'react-redux';  
import { compose, lifecycle } from 'recompose';
import { fetch } from './action';

export function WeatherFetch({ temperature, windSpeed }) {  
   return (
     <WeatherInfo temperature={temperature} windSpeed={windSpeed} />
   );
}

function mapStateToProps(state) {  
  return {
    temperature: state.temperate,
    windSpeed: state.windSpeed
  };
}

export default compose(
  connect(mapStateToProps, { fetch }),
  lifecycle({
    componentDidMount() {
      this.props.fetch();
    }
  })
)(WeatherFetch);
```

## 可测试性

> A tested component is verified whether it renders the expected output for a given input.
A testable component is easy to test.

如何确保组件按照我们的期望工作, 通常我们会改下数据或者条件之类的然后在浏览器中看结果, 称之为手动验证。 这样手动验证有一些缺点:

1. 临时修改代码为了验证容易出错
2. 每次修改代码 每次验证很低效

因此, 我们需要需要编写一些unit tests来帮助我们测试组件, 但是编写unit tests的前提是, 我们的组件是可测试的, 一个不可测试的组件绝对是设计不良的。

> A component that is untestable or hard to test is most likely badly designed. 

组件变得难以测试有很多因素, 比如太多的props, 高度耦合, 全局变量等等, 下面通过一个例子让我们理解如何编写可测试组件。

编写一个`Controls`组件, 目的是实现一个计数器, 点击`Increase`则加1, 点击`Decrease`则减1, 先来一个错误的设计

```javascript
<Control parent={ConponentName}
```

假设我们是这样使用的, 意图是我们传入一个父组件, 点击`Control`的加减操作会修改父组件的state值

```javascript
import assert from 'assert';
import { shallow } from 'enzyme';

class Controls extends Component {
  render() {
    return (
      <div className="controls">
        <button onClick={() => this.updateNumber(+1)}>
          Increase
        </button> 
        <button onClick={() => this.updateNumber(-1)}>
          Decrease
        </button>
      </div>
    );
  }
  updateNumber(toAdd) {
    this.props.parent.setState(prevState => ({
      number: prevState.number + toAdd       
    }));
  }
}

class Temp extends Component {
  constructor(props) {
    super(props);
    this.state = { number: 0 };
  }
  render() {
    return null;
  }
}

describe('<Controls />', function() {
  it('should update parent state', function() {
    const parent = shallow(<Temp/>);
    const wrapper = shallow(<Controls parent={parent} />);

    assert(parent.state('number') === 0);

    wrapper.find('button').at(0).simulate('click');
    assert(parent.state('number') === 1);

    wrapper.find('button').at(1).simulate('click');
    assert(parent.state('number') === 0); 
  });
});
```

由于我们设计的`Controls`组件与父组件依赖很强, 导致我们编写单元测试很复杂, 这时我们就应该思考重构这个`Controls`提高它的可测试性了。

```javascript
import assert from 'assert';
import { shallow } from 'enzyme';
import { spy } from 'sinon';

function Controls({ onIncrease, onDecrease }) {
  return (
    <div className="controls">
      <button onClick={onIncrease}>Increase</button> 
      <button onClick={onDecrease}>Decrease</button>
    </div>
  );
}

describe('<Controls />', function() {
  it('should execute callback on buttons click', function() {
    const increase = sinon.spy();
    const descrease = sinon.spy();
    const wrapper = shallow(
      <Controls onIncrease={increase} onDecrease={descrease} />
    );

    wrapper.find('button').at(0).simulate('click');
    assert(increase.calledOnce);
    wrapper.find('button').at(1).simulate('click');
    assert(descrease.calledOnce);
  });
});
```

重构后我们的组件使用方法变为 `<Controls onIncrease={increase} onDecrease={descrease} />`, 这样的使用方式彻底解耦了`Controls`和父组件之间的关系, 即: `Controls`只负责按钮UI的渲染。

## 可读性

> A meaningful component is easy to understand what it does. 

代码的可读性对于产品迭代的重要性是不可忽视的, obscured code不仅会让维护者头疼, 甚至我们自己也无法理解代码的意图。曾经有一个有趣的统计, 编程工作是由: 75%的读代码(理解) + 20%的修改现有代码 + 5%新代码组成的。

self-explanatory code无疑是提高代码可读性最直接最好的方法

举一个例子:

```javascript
// <Games> renders a list of games
// "data" prop contains a list of game data
function Games({ data }) {
  // display up to 10 first games
  const data1 = data.slice(0, 10);
  // Map data1 to <Game> component
  // "list" has an array of <Game> components
  const list = data1.map(function(v) {
    // "v" has game data
    return <Game key={v.id} name={v.name} />;
  });
  return <ul>{list}</ul>;
}

<Games 
   data=[{ id: 1, name: 'Mario' }, { id: 2, name: 'Doom' }] 
/>
```

下面让我们重构这段代码, 使它可以 **self-explanatory** 和 **self-documenting** .

```javascript
const GAMES_LIMIT = 10;

function GamesList({ items }) {
  const itemsSlice = items.slice(0, GAMES_LIMIT);
  const games = itemsSlice.map(function(gameItem) {
    return <Game key={gameItem.id} name={gameItem.name} />;
  });
  return <ul>{games}</ul>;
}

<GamesList 
  items=[{ id: 1, name: 'Mario' }, { id: 2, name: 'Doom' }]
/>
```

一个可读性良好的React组件应该做到: 通过读`name`和`props`就可以看出这段代码的意图。 

## 写在最后的

即使编写出了自我感觉良好的组件, 我们也该在一次一次迭代中去 Do continuous improvement, 正如作家William Zinsse说过一句话

> rewriting is the essence of writing. I pointed out that professional writers rewrite their sentences over and over and then rewrite what they have rewritten. 

重构, 编写高质量, 可扩展, 可维护的应用是每个开发人员的追求。

本文参考: [7 Architectural Attributes of a Reliable React Component](https://dmitripavlutin.com/7-architectural-attributes-of-a-reliable-react-component/#8-do-continuous-improvement)



