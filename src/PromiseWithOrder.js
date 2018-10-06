export default class PromiseWithOrder {
  constructor() {
    this.lastPromise = Promise.resolve();
  }

  wrap(promise, config = {}) {
    const { lastPromise } = this;
    const orderedPromise = new Promise((resolve, reject) => {
      // catch promise so it does not throw unhandled rejection on original promise
      promise.catch(() => 'do nothing');

      // wait for last wrapped promise to get resolved and then resolve
      lastPromise.then(() => promise).then(resolve, reject);
    });

    // if allowReject is set true, assume current promise will always resolve for the next chained promise
    if (config.allowReject) {
      this.lastPromise = new Promise((resolve, reject) => {
        lastPromise.then(() => promise.then(resolve, resolve)).then(resolve, reject);
      });
    } else {
      this.lastPromise = orderedPromise;
    }

    return orderedPromise;
  }

  reset() {
    this.lastPromise = Promise.resolve();
  }
}
