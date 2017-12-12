# apollo-cache-persist [![npm version](https://badge.fury.io/js/apollo-cache-persist.svg)](https://badge.fury.io/js/apollo-cache-persist) [![build status](https://travis-ci.org/apollographql/apollo-cache-persist.svg?branch=master)](https://travis-ci.org/apollographql/apollo-cache-persist)

Simple persistence for all Apollo Client 2.0 cache implementations, including
[`InMemoryCache`][0] and [`Hermes`][1].

Supports web and React Native. [See all storage providers.](#storage-providers)

[0]: https://github.com/apollographql/apollo-client/tree/master/packages/apollo-cache-inmemory
[1]: https://github.com/convoyinc/apollo-cache-hermes

## Basic Usage

To get started, simply pass your Apollo cache and an
[underlying storage provider](#storage-providers) to `persistCache`.

By default, the contents of your Apollo cache will be immediately restored
(asynchronously), and will be persisted upon every write to the cache (with a
short debounce interval).

### Examples

#### React Native

```js
import { AsyncStorage } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';

const cache = new InMemoryCache({...});

persistCache({
  cache,
  storage: AsyncStorage,
});

// Continue setting up Apollo as usual.
```

#### Web

```js
import { InMemoryCache } from 'apollo-cache-inmemory';
import { persistCache } from 'apollo-cache-persist';

const cache = new InMemoryCache({...});

persistCache({
  cache,
  storage: window.localStorage,
});

// Continue setting up Apollo as usual.
```

### Additional Options

`persistCache` and the constructor for `CachePersistor` accept the following
options:

```ts
persistCache({
  /**
   * Required options.
   */

  // Reference to your Apollo cache.
  cache: ApolloCache<TSerialized>,

  // Reference to your storage provider.
  storage: PersistentStorage<TPersisted>,

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
});
```

## Advanced Usage

### Using `CachePersistor`

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

### Custom Triggers

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

## Storage Providers

The following storage providers work 'out of the box', with no additional
dependencies:

* `AsyncStorage` on React Native
* `window.localStorage` on web
* `window.sessionStorage` on web
* [`localForage`](https://github.com/localForage/localForage) on web

`apollo-cache-persist` uses the same storage provider API as
[`redux-persist`](https://github.com/rt2zz/redux-persist), so you can also make
use of the providers
[listed here](https://github.com/rt2zz/redux-persist#storage-engines),
including:

* [`redux-persist-node-storage`](https://github.com/pellejacobs/redux-persist-node-storage)
* [`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage)
* [`redux-persist-cookie-storage`](https://github.com/abersager/redux-persist-cookie-storage)

If you're using React Native and set a `maxSize` in excess of 2 MB, you must use
a filesystem-based storage provider, such as
[`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage).
`AsyncStorage`
[does not support](https://github.com/facebook/react-native/issues/12529#issuecomment-345326643)
individual values in excess of 2 MB on Android.

## Common Questions

#### Why is the 'background' trigger only available for React Native?

Quite simply, because mobile apps are different than web apps.

Mobile apps are rarely terminated before transitioning to the background. This
is helped by the fact that an app is moved to the background whenever the user
returns home, activates the multitasking view, or follows a link to another app.
There's almost always an opportunity to persist.

On web, we _could_ support a 'background' trigger with the
[Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API);
however, data would be lost if the user closed the tab/window directly. Given
this prevalence of this user behavior and the substantially better performance
of the 'write' trigger on web, we've omitted a 'background' trigger on web.

#### I need to ensure certain data is not persisted. How do I filter my cache?

Unfortunately, this is not yet possible. You can only persist and restore the
cache in its entirety.

This library depends upon the `extract` and `persist` methods defined upon the
cache interface in Apollo Client 2.0. The payload returned and consumed by these
methods is opaque and differs from cache to cache. As such, we cannot reliably
transform the output.

Alternatives have been recommended in
[#2](https://github.com/apollographql/apollo-cache-persist/issues/2#issuecomment-350823835),
including using logic in your UI to filter potentially-outdated information.
Furthermore, the [`maxSize` option](#additional-options) and
[methods on `CachePersistor`](#using-cachepersistor) provide facilities to
manage the growth of the cache.

For total control over the cache contents, you can setup a background task to
periodically reset the cache to contain only your app’s most important data. (On
the web, you can use a service worker; on React Native, there’s
[`react-native-background-task`](https://github.com/jamesisaac/react-native-background-task).)
The background task would start with an empty cache, query the most important
data from your GraphQL API, and then persist. This strategy has the added
benefit of ensuring the cache is loaded with fresh data when your app launches.

Finally, it's worth mentioning that the Apollo community is in the early stages
of designing fine-grained cache controls, including the ability to utilize
directives and metadata to control cache policy on a per-key basis, so the
answer to this question will eventually change.

#### I've had a breaking schema change. How do I migrate or purge my cache?

For the same reasons given in the preceding answer, it's not possible to migrate
or transform your persisted cache data. However, by using the
[methods on `CachePersistor`](#using-cachepersistor), it's simple to reset the
cache upon changes to the schema.

Simply instantiate a `CachePersistor` and only call `restore()` if the app's
schema hasn't change. (You'll need to track your schema version yourself.)

Here's an example of how this could look:

```js
import { AsyncStorage } from 'react-native';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { CachePersistor } from 'apollo-cache-persist';

const SCHEMA_VERSION = '3'; // Must be a string.
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

async function setupApollo() {
  const cache = new InMemoryCache({...});

  const persistor = new CachePersistor({
    cache,
    storage: AsyncStorage,
  });

  // Read the current schema version from AsyncStorage.
  const currentVersion = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);

  if (currentVersion === SCHEMA_VERSION) {
    // If the current version matches the latest version,
    // we're good to go and can restore the cache.
    await persistor.restore();
  } else {
    // Otherwise, we'll want to purge the outdated persisted cache
    // and mark ourselves as having updated to the latest version.
    await persistor.purge();
    await AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }

  // Continue setting up Apollo as usual.
}
```

#### I'm seeing errors on Android.

Specifically, this error:

```
BaseError: Couldn't read row 0, col 0 from CursorWindow.  Make sure the Cursor is initialized correctly before accessing data from it.
```

This is the result of a 2 MB per key limitation of `AsyncStorage` on Android. Set
a smaller `maxSize` or switch to a filesystem-based storage provider, such as
[`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage).
