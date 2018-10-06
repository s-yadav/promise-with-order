import PromiseWithOrder from '../src/PromiseWithOrder';

function getPromise(data, time, rejects) {
  return new Promise((resolve, reject) => {
    setTimeout(rejects ? reject.bind(null, `err-${data}`) : resolve.bind(null, data), time);
  });
}

async function getResult(promises) {
  const results = [];

  await Promise.all(promises.map(async (promise, idx) => {
    try {
      results.push(await promise);
    } catch (err) {
      results.push(err);
    }
  }));

  return results;
}

describe('Tet PromiseWithOrder', () => {
  it('all wrapped promise should resolve in sequential order', async () => {
    const pwo = new PromiseWithOrder();
    const promise1 = pwo.wrap(getPromise(1, 1000), { allowReject: true });
    const promise2 = pwo.wrap(getPromise(2, 100));
    const promise3 = pwo.wrap(getPromise(3, 2000));

    const results = await getResult([promise1, promise2, promise3]);

    expect(results).toEqual([1, 2, 3]);
  });

  it('should reject all subsequent wrapped promise, if any promise rejects', async () => {
    const pwo = new PromiseWithOrder();
    const promise1 = pwo.wrap(getPromise(1, 1000));
    const promise2 = pwo.wrap(getPromise(2, 100, true));
    const promise3 = pwo.wrap(getPromise(3, 2000));

    const results = await getResult([promise1, promise2, promise3]);

    expect(results).toEqual([1, 'err-2', 'err-2']);

    // it should reject even if subsequent promise has allowReject true
    pwo.reset();
    const promise4 = pwo.wrap(getPromise(4, 1000, true));
    const promise5 = pwo.wrap(getPromise(5, 100, true), { allowReject: true });
    const promise6 = pwo.wrap(getPromise(6, 2000));

    const results2 = await getResult([promise4, promise5, promise6]);

    expect(results2).toEqual(['err-4', 'err-4', 'err-4']);
  });

  it('does not reject all subsequent promise if, allowReject is set to true for a rejected promise', async () => {
    const pwo = new PromiseWithOrder();
    const promise1 = pwo.wrap(getPromise(1, 1000));
    const promise2 = pwo.wrap(getPromise(2, 100, true), { allowReject: true });
    const promise3 = pwo.wrap(getPromise(3, 2000));

    const results = await getResult([promise1, promise2, promise3]);

    expect(results).toEqual([1, 'err-2', 3]);
  });
});
