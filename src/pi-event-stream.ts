/** Minimal OpenClaw/pi-ai-compatible event stream (no @earendil-works/pi-ai dependency). */

type StreamWaiter<T> = (value: { value: T | undefined; done: boolean }) => void;

class EventStream<T, R = T> implements AsyncIterable<T> {
  private queue: T[] = [];
  private waiting: StreamWaiter<T>[] = [];
  private done = false;
  private finalResultPromise: Promise<R>;
  private resolveFinalResult!: (value: R) => void;

  constructor(
    private readonly isComplete: (event: T) => boolean,
    private readonly extractResult: (event: T) => R,
  ) {
    this.finalResultPromise = new Promise((resolve) => {
      this.resolveFinalResult = resolve;
    });
  }

  push(event: T): void {
    if (this.done) return;
    if (this.isComplete(event)) {
      this.done = true;
      this.resolveFinalResult(this.extractResult(event));
    }
    const waiter = this.waiting.shift();
    if (waiter) waiter({ value: event, done: false });
    else this.queue.push(event);
  }

  end(result?: R): void {
    this.done = true;
    if (result !== undefined) this.resolveFinalResult(result);
    while (this.waiting.length > 0) {
      const waiter = this.waiting.shift();
      waiter?.({ value: undefined, done: true });
    }
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    while (true) {
      if (this.queue.length > 0) {
        yield this.queue.shift() as T;
      } else if (this.done) {
        return;
      } else {
        const result = await new Promise<{ value: T | undefined; done: boolean }>((resolve) =>
          this.waiting.push(resolve),
        );
        if (result.done) return;
        yield result.value as T;
      }
    }
  }

  result(): Promise<R> {
    return this.finalResultPromise;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AssistantMessageEvent = any;

export class AssistantMessageEventStream extends EventStream<
  AssistantMessageEvent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> {
  constructor() {
    super(
      (event) => event.type === "done" || event.type === "error",
      (event) => {
        if (event.type === "done") return event.message;
        if (event.type === "error") return event.error;
        throw new Error("Unexpected event type for final result");
      },
    );
  }
}

export function createAssistantMessageEventStream(): AssistantMessageEventStream {
  return new AssistantMessageEventStream();
}
