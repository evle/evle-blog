Function.prototype.after = function (fn) {
  return (...args) => {
    fn();
    this(...args);
  };
};
// 作用域的问题 箭头函数

function greet(args) {
  console.log('hello', args);
}

const newG = greet.after(() => console.log('max'));
newG('ab, cd, ef');

class Transaction {
  perform(anyMethod, wrapper) {
    wrapper.forEach(w => w.init());
    anyMethod();
    wrapper.forEach(w => w.close());
  }
}

const transation = new Transaction();


const oldFunc = () => {
  console.log('old func');
};

transation.perform(
  oldFunc,
  [{
    init() {
      console.log('init1');
    },
    close() {
      console.log('close1');
    }
  }, {
    init() {
      console.log('init2');
    },
    close() {
      console.log('close2');
    }
  }]
);


// 判断数据类型
// typeof 对象还是数组

const isType = type => arg =>
// console.log('!!', toString.call(arg), type);
  Object.prototype.toString.call(arg) === `[object ${type}]`;

const type = ['String', 'Boolean', 'Number', 'Null', 'Undefined'];

const utils = {};


type.forEach((type) => {
  utils[`is${type}`] = isType(type);
});


const res = utils.isString('abc');
console.log('!!', res);

// const after = (n, fn) => {
// 	let count = n;
// 	return () => {
// 		--count === 0 && fn();
// 	};
// };

// const runManyTimes = after(3, () => {
// 	console.log('code');
// });
// runManyTimes();
// runManyTimes();
// runManyTimes();
// runManyTimes();
// runManyTimes();

const fs = require('fs');

let content = '';

class Subject {
  constructor() {
    this.stack = [];
  }

  attach(observer) {
    this.stack.push(observer);
  }

  notify() {
    this.stack.forEach(observer => observer.onChange());
  }
}
class Observer {
  constructor(cb) {
    this.cb = cb;
  }
  onChange() {
    this.cb();
  }
}

const observer1 = new Observer(() => {
  --count === 0 && fs.writeFile('./fileC', content, err => console.log(err));
});

const observer2 = new Observer(() => {
  console.log('data loaded');
});

const subject = new Subject();

subject.attach(observer1);
subject.attach(observer2);

let count = 2;


fs.readFile('./fileA', 'utf-8', (err, data) => {
  content += data;
  subject.notify();
});

fs.readFile('./fileB', 'utf-8', (err, data) => {
  content += data;
  subject.notify();
});
