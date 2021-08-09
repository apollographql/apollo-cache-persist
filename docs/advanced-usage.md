# Advanced Usage

- [Additional Options](#additional-options)
- [Using `CachePersistor`](#using-cachepersistor)
- [Custom Triggers](#custom-triggers)

## Additional Options

`persistCache` and the constructor for `CachePersistor` accept the following
options:

```ts
persistCache({
  /**
   * Required options.
   */

  // Reference to your Apollo cache.
  cache: ApolloCache<TSerialized>,

  // Reference to your storage provider wrapped in a storage wrapper implementing PersistentStorage interface.
  storage: PersistentStorage,

  /**
   * Trigger options.
   */

  // When to persist the cache.
  //
  // 'write': Persist upon every write to the cache. Default.
  // 'background': Persist when your app moves to the background. React Native only.
  //
  // For a custom trigger, provide a function. See below for more information.
  // To disable automatic persistence and manage persistence manually, provide false.
  trigger?: 'write' | 'background' | function | false,

  // Debounce interval between persists (in ms).
  // Defaults to 0 for 'background' and 1000 for 'write' and custom triggers.
  debounce?: number,

  /**
   * Storage options.
   */

  // Key to use with the storage provider. Defaults to 'apollo-cache-persist'.
  key?: string,

  // Whether to serialize to JSON before/after persisting. Defaults to true.
  serialize?: boolean,

  // Maximum size of cache to persist (in bytes).
  // Defaults to 1048576 (1 MB). For unlimited cache size, provide false.
  // If exceeded, persistence will pause and app will start up cold on next launch.
  maxSize?: number | false,

  /**
   * Debugging options.
   */

  // Enable console logging.
  debug?: boolean,

}): Promise<void>;
```

## Using `CachePersistor`

Instead of using `persistCache`, you can instantiate a `CachePersistor`, which
will give you fine-grained control of persistence.

`CachePersistor` accepts the same options as `persistCache` and returns an
object with the following methods:

```js
const persistor = new CachePersistor({...});

persistor.restore();   // Immediately restore the cache. Returns a Promise.
persistor.persist();   // Immediately persist the cache. Returns a Promise.
persistor.purge();     // Immediately purge the stored cache. Returns a Promise.

persistor.pause();     // Pause persistence. Triggers are ignored while paused.
persistor.resume();    // Resume persistence.
persistor.remove();    // Remove the persistence trigger. Manual persistence required after calling this.

// Obtain the most recent 30 persistor loglines.
// `print: true` will print them to the console; `false` will return an array.
persistor.getLogs(print);

// Obtain the current persisted cache size in bytes. Returns a Promise.
// Resolves to 0 for empty and `null` when `serialize: true` is in use.
persistor.getSize();
```

Additionally, you can control what portions of your cache are persisted by passing
a `persistenceMapper` function as an optional paramemter to the `CachePersistor`. E.g.

```ts
const persistor = new CachePersistor({
  ...
  persistenceMapper: async (data: any) => {
    // filter your cached data and queries
    return filteredData;
  },
})
```

Take a look at the [examples](../examples/react-native/src/utils/persistence/persistenceMapper.ts)
and [it's corresponding documentation](../examples/react-native/src/utils/persistence/README.md)

## Custom Triggers

For control over persistence timing, provide a function to the `trigger` option.

The custom trigger should accept one argument (a `persist` callback function),
and it should return a function that can be called to uninstall the trigger.

The TypeScript signature for this function is as follows:

```ts
(persist: () => void) => (() => void)
```

For example, this custom trigger will persist every 10 seconds:

```js
// This code is for illustration only.
// We do not recommend persisting on an interval.

const trigger = persist => {
  // Call `persist` every 10 seconds.
  const interval = setInterval(persist, 10000);

  // Return function to uninstall this custom trigger.
  return () => clearInterval(interval);
};
```
