class Interceptor {
  constructor() {
    this.stack = [];
  }

  use(fn) {
    this.stack.push(fn);
  }
  eject() {}
}

class Axios {
  constructor() {
    this.config = { headers: {} };
    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    };
  }

  get() {
    this.flow = [];
    let promise = Promise.resolve(this.config);
    this.interceptors.request.stack.forEach(fn => this.flow.unshift(fn));
    // console.log(this.flow.toString());

    while (this.flow.length) {
      const current = this.flow.shift();
      // console.log(current.toString())
      promise = promise.then(current);
    }

    return promise;
  }
}

const axios = new Axios();
// console.log(axios.config);

axios.interceptors.request.use((config) => {
  config.headers.name = 'evle';
  return config;
});
axios.interceptors.request.use((config) => {
  config.headers.age = '16';
  return config;
});
axios.get().then((a, b) => {
  console.log(a, b);
});
// console.log(axios.interceptors.request);
// axios.interceptors.response.use(config => (config.headers.name = 'evle'));
