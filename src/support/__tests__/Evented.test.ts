import { Evented } from "../Evented";

const createSelfResolvingPromise = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("emit()", () => {
  it("executes event listeners for the related event", async () => {
    const promises: Promise<void>[] = [];
    const promiseA = createSelfResolvingPromise();
    const promiseB = createSelfResolvingPromise();
    const listenerA = () => promises.push(promiseA);
    const listenerB = () => promises.push(promiseB);
    const evented = new Evented();
    evented.on("x", listenerA);
    evented.on("x", listenerB);

    evented.emit("x");
    // Events are kicked off async, use promises to ensure they're executed.
    await Promise.all([promiseA, promiseB]);

    expect(promises).toHaveLength(2);
  });

  it("does not execute event listeners for the unrelated events", async () => {
    const promises: Promise<void>[] = [];
    const promiseA = createSelfResolvingPromise();
    const promiseB = createSelfResolvingPromise();
    const listenerA = () => promises.push(promiseA);
    const listenerB = () => promises.push(promiseB);
    const evented = new Evented();
    evented.on("x", listenerA);
    evented.on("y", listenerB);

    evented.emit("x");
    // Events are kicked off async, use promises to ensure they're executed.
    await Promise.all([promiseA, promiseB]);

    expect(promises).toHaveLength(1);
  });

  it("does not execute event listeners that have been cancelled wih IHandle.remove()", async () => {
    const promises: Promise<void>[] = [];
    const promiseA = createSelfResolvingPromise();
    const listenerA = () => promises.push(promiseA);
    const evented = new Evented();
    const handle = evented.on("x", listenerA);

    handle.remove();
    evented.emit("x");
    // Events are kicked off async, use promises to ensure they're executed.
    await Promise.all([promiseA]);

    expect(promises).toHaveLength(0);
  });

  it("does not execute event listeners when destroyed)", async () => {
    const promises: Promise<void>[] = [];
    const promiseA = createSelfResolvingPromise();
    const listenerA = () => promises.push(promiseA);
    const evented = new Evented();
    const handle = evented.on("x", listenerA);

    evented.destroy();
    evented.emit("x");
    // Events are kicked off async, use promises to ensure they're executed.
    await Promise.all([promiseA]);

    expect(promises).toHaveLength(0);
  });
});
