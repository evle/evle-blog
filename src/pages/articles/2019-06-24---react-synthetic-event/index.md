---
title: "React Synthetic Event 详解"
date: "2019-06-24"
layout: post
draft: false
path: "/posts/react-synthetic-event"
category: "React"
tags:
  - React
  - Synthetic Event
description: ""
---

SyntheticEvent 是 React 在浏览器事件基础上做的一层包装器，基本上 SyntheticEvent 和浏览器的原生事件有相同的接口，也能够进行 stopPropagation() 和 preventDefault()，并且事件在所有浏览器中的工作方式相同。

获取navtive Event： `nativeEvent`
事件中return false不会影响事件传递 必须 stopPropagation 或者 preventDefault

Event Pooling

上面截图中不仅有一个 warning，在异步中 event.type 会返回 null，因此，如果在异步中要使用诸如 event.type 的属性，建议是通过一个 常量 来保存。

因为这种事件池的特性， 也不能直接使用 this.setState({event:event}) 来保存 event 对象，因为 setState 是异步的，没办法直接保存 event 对象。但是直接保存 event.type 是可行的。

如果需要异步访问事件属性，应在事件上调用 event.persist()，这种操作将从事件池中删除 SyncthesicEvent，并允许用户代码保留对事件的引用。

规范化事件 在不同浏览器中有一致的属性

下面事件由冒泡阶段的事件触发 如果要在补货阶段注册 需要将capture附加到事件名称
比如 onClickCapture 代替 onClick

Clipboard Events
onCopy
onCut
onPaste


onKeyDown
onKeyPress
onKeyUp

Composition 事件
onCompositionEnd
onCompositionStart
onCompositionUpdate


Focus 事件
onFocus
onBlur


Form 事件
onChange 
onInput 
onInvalid 
onSubmit

onClick
onContextMenu
onDoubleClick
onDrag 
onDragEnd 
onDragEnter
onDragExit
onDragLeave
onDragOver
onDragStart
onDrop
onMouseDown
onMouseEnter 
onMouseLeave
onMouseMove
onMouseOut
onMouseOver 
onMouseUp



其他事件
onToggle


过渡事件
onTransitionEnd
属性类型	属性名
string| propertyName|
|string| pseudoElement|
|float| elapsedTime|



动画事件
onAnimationStart
onAnimationEnd
onAnimationIteration

图片事件
onLoad
onError

媒体事件
onAbort
onCanPlay
onCanPlayThrough
onDurationChange
onEmptied
onEncrypted
onEnded
onError
onLoadedData
onLoadedMetadata
onLoadStart
onPause
onPlay
onPlaying
onProgress
onRateChange
onSeeked
onSeeking
onStalled 
onSuspend
onTimeUpdate 
onVolumeChange
onWaiting

鼠标滚轮事件
onWheel


UI 事件
onScroll

选择事件
onSelect
8、Touch 事件
onTouchCancel
onTouchEnd 
onTouchMove 
onTouchStart


指针事件
onPointerDown
onPointerMove
onPointerUp
onPointerCancel
onGotPointerCapture
onLostPointerCapture
onPointerEnter 
onPointerLeave
onPointerOver
onPointerOut


React setState实现 

setState 通过一个队列机制实现 state 更新。

当执行 setState 的时候，会将需要更新的 state 合并后放入状态队列，而不会立即更新 this.state ，队列机制可以高效的批量更新 state。

如果不通过 setState 而直接修改 this.state 值，那么该 state 将不会被放入状态队列中，当下次调用 setState 并对状态队列进行合并时，将会忽略之前直接被修改的 state，而造成无法预知的错误。

当调用 setState 方法的时候实际上会执行 enqueueSetState 方法，并且对 partialState 和 _pendingStateQueue 更新队列进行合并操作，最终通过 enqueueUpdate 执行 state 更新。

而 performUpdateIfNessary 方法会获取 _pendingElement、_pendingStateQueue、_pendingForceUpdate，并调用 receiveComponent 和 updateComponent 方法进行组件更新。

如果在 shouldComponentUpdate 和 componentWillUpdate 中调用 setState ，此时 this._pendingStateQueue != null，则 performUpdateIfNessary 方法就会调用 updateComponent 方法进行组件更新，而 updateComponent 方法又会调用 shouldComponentUpdate 和 componentWillUpdate 方法，因此造成循环调用，耗光浏览器内存之后崩溃掉。

