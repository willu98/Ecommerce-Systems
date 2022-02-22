import { Observable, of } from 'rxjs';

export class InMemoryCache<T> {
  private static sharedCache: { [name: string]: InMemoryCache<any> } = {};
  private cachedValue?: T;
  private cachedObservable: Observable<T>;

  constructor(private cacheKey: string, observable: Observable<T>) {
    InMemoryCache.sharedCache[this.cacheKey] = this;
    this.cachedObservable = new Observable<T>(subscriber => {
      observable.subscribe({
        error: (error) => subscriber.error(error),
        next: (value: T) => {
          this.cachedValue = value;
          subscriber.next(value);
          subscriber.complete();
        }
      });
    });
  }

  get observable(): Observable<T> {
    return this.cachedValue ? of(this.cachedValue) : this.cachedObservable;
  }

  static putCache<V>(cacheKey: string, observable: Observable<V>): InMemoryCache<V> {
    return (new InMemoryCache<V>(cacheKey, observable));
  }

  static getCache<V>(cacheKey: string): InMemoryCache<V> {
    return InMemoryCache.sharedCache[cacheKey] as InMemoryCache<V>;
  }

  static hasCache(cacheKey: string): boolean {
    return !!InMemoryCache.getCache(cacheKey);
  }
}