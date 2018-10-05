export default class PromiseWithOrder {
  constructor() {
    this.promises = [];
  }

  wrap(promise, config) {
    const { promises } = this;
    let promiseToTrack = promise;

    if (config.allowReject) {
      promiseToTrack = new Promise((resolve) => {
        promise.then(resolve, resolve);
      });
    }

    const orderedPromise = Promise.all([...promises, promise]).then(values => values.pop());

    // track older promise
    promises.push(promiseToTrack);

    return orderedPromise;
  }

  reset() {
    this.promise = [];
  }
}
