import PromiseWithOrder from '../src/PromiseWithOrder';

function getPromise(time, rejects) {
  return new Promise((resolve, reject) => {
    setTimeout(rejects ? reject : resolve, time);
  });
}

async function getResult(promises) {
  const results = [];

  [promise1, promise2, promise3].forEach((promise, idx) => {
    promise.then(() => {
      results[idx] = 1;
    }, () => {
      results[idx] = 0;
    });
  });

  await Promise.all(promises);

  return results;
}

describe('Tet PromiseWithOrder', () => {
  it('all wrapped promise should resolve in sequential order', async () => {
    const pwo = new PromiseWithOrder();
    const promise1 = pwo.wrap(getPromise(1000));
    const promise2 = pwo.wrap(getPromise(100));
    const promise3 = pwo.wrap(getPromise(2000));

    const results = await getResult([promise1, promise2, promise3]);

    expect(results).toEqual([1, 1, 1]);
  });
  
  it('should reject all subsequent wrapped promise, if any promise fails', async () => {
    const pwo = new PromiseWithOrder();
    const promise1 = pwo.wrap(getPromise(1000));
    const promise2 = pwo.wrap(getPromise(100, true));
    const promise3 = pwo.wrap(getPromise(2000));

    const results = await getResult([promise1, promise2, promise3]);

    expect(results).toEqual([1, 0, 0]);
  });

  it('does not reject all subsequent promise if, allowReject is set to true for a promise', () => {
    const pwo = new PromiseWithOrder();
    const promise1 = pwo.wrap(getPromise(1000));
    const promise2 = pwo.wrap(getPromise(100, true), {allowReject: true});
    const promise3 = pwo.wrap(getPromise(2000));

    const results = await getResult([promise1, promise2, promise3]);

    expect(results).toEqual([1, 0, 1]);
  });
});
