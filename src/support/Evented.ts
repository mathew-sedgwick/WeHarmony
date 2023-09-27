import { IHandle } from "./IHandle";

export type EventListener<
  TArgs = unknown,
  UTarget extends Evented = Evented
> = (event: string, args: TArgs, target: UTarget) => void;

export class Evented implements Evented {
  private readonly _listeners = new Map<string, EventListener[]>();
  private readonly _listenerHandles = new Map<EventListener, IHandle>();
  on(event: string, listener: EventListener): IHandle {
    const listeners = this._listeners.get(event) ?? [];
    listeners.push(listener);
    this._listeners.set(event, listeners);
    const handle = {
      remove: () => {
        const listeners = this._listeners.get(event) ?? [];
        const index = listeners.indexOf(listener);
        if (index >= 0) {
          listeners.splice(index, 1);
        }
        this._listeners.set(event, listeners);
      },
    };
    this._listenerHandles.set(listener, handle);
    return handle;
  }

  emit<TArgs = unknown>(event: string, args?: TArgs): void {
    const listeners = this._listeners.get(event) ?? [];
    listeners.map(async (listener) => {
      try {
        listener(event, args, this);
      } catch (e) {
        throw new Error(
          `Evented: Failed to execute listener for event ${event}`,
          { cause: e }
        );
      }
    });
  }

  destroy(): void {
    [...this._listenerHandles.values()].forEach((h) => h.remove());
    this._listenerHandles.clear();
    this._listeners.clear();
  }
}
