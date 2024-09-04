import { defer, of } from "rxjs";

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export function asyncError<T>(error: T) {
  return defer(() => Promise.reject(error));
}

export function mockObservable<T>(data: T) {
  return of(data);
}

export function mockOPromise<T>(data: T) {
  return Promise.resolve(data);
}


