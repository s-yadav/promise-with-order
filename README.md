# promise-with-order
Micro module to resolve multiple promises in order. 

Lot of time you want to trigger multiple async task together but you want them to get resolved sequentially. PromiseWithOrder wraps passed promise to a promise which resolves in sequential order.

Installation
```
npm install promise-with-order
```

### Example
```js
import PromiseWithOrder from 'promise-with-order';

/**
 * Create a instance of PromiseWithOrder in which all wrapped promise will be resolved sequentially.
*/
const pwo = new PromiseWithOrder();

/* 
  Usage
*/

const promise1 = pwo.wrap(asyncTask()); //asyncTask task return a promise here which resolves after 1s.
const promise2 = pwo.wrap(somePromise); //promise which resolves after .5s
const promise3 = pwo.wrap(Promise.resolve('Hello World!!'));

promise1.then(() => {
  console.log('Resolved Promise1.');
});

promise2.then(() => {
  console.log('Resolved Promise2.');
});

promise3.then((data) => {
  console.log('Resolved Promise3.');
  console.log(data);
});

/** log will be 
  Resolved Promise1.
  Resolved Promise2.
  Resolved Promise3.
  Hello world
**/
```
Notice here even the promise resolves in any order, the wrapped promise are always resolved in order. 

### Promise rejections
By default if any of the promise fails, all the subsequent wrapped promise will fail. This is considering you need resolve to be in order only when a resolution of promise is dependent on previous resolution.

```js
const promise1 = pwo.wrap(asyncTask()); //asyncTask task return a promise here which resolves after 1s.
const promise2 = pwo.wrap(Promise.rejects('error in promise 2')); 
const promise3 = pwo.wrap(somePromise); //promise which resolves after .5s

promise1.then(() => {
  console.log('Resolved Promise1.');
});

promise2.catch((err) => {
  console.log(`Promise 2 got rejected because of ${err}.`);
});

promise3.then(() => {
  console.log('Resolved Promise3.');
}, (err) => {
  console.log(`Promise 3 got rejected because of ${err}.`);
});

/** log will be 
  Resolved Promise1.
  Promise 2 got rejected because of error in promise 2.
  Promise 3 got rejected because of error in promise 2.
**/
```

But in case a promise does not have side effect on next promise but still has to be resolved in order. You can pass `allowReject` flag.
```js
const promise1 = pwo.wrap(asyncTask()); //asyncTask task return a promise here which resolves after 1s.
const promise2 = pwo.wrap(Promise.rejects('error in promise 2'), {allowReject: true}); 
const promise3 = pwo.wrap(somePromise); //promise which resolves after .5s

promise1.then(() => {
  console.log('Resolved Promise1.');
});

promise2.catch((err) => {
  console.log(`Promise 2 got rejected because of ${err}.`);
});

promise3.then(() => {
  console.log('Resolved Promise3.');
}, (err) => {
  console.log(`Promise 3 got rejected because of ${err}.`);
});

/** log will be 
  Resolved Promise1.
  Promise 2 got rejected because of error in promise 2.
  Resolved Promise3..
**/
```

### Resetting PromiseWithOrder instance
You can use `.reset` method to reset PromiseWithOrder instance.
```js
const promise1 = pwo.wrap(p1);
const promise2 = pwo.wrap(p2);

pwo.reset();

const promise3 = pwo.wrap(p3);
const promise4 = pwo.wrap(p4);
```
In this promise1 and promise2 will be resolved in order. Same for the promise3 and promise4. But promise3 and promise 4 is independent of promise1 or promise2.
