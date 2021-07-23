# apollo3-cache-persist [![npm version](https://badge.fury.io/js/apollo3-cache-persist.svg)](https://badge.fury.io/js/apollo3-cache-persist) [![build status](https://travis-ci.org/apollographql/apollo-cache-persist.svg?branch=master)](https://travis-ci.org/apollographql/apollo-cache-persist)

Simple persistence for all Apollo Client 3.0 cache implementations, including
[`InMemoryCache`][0] and [`Hermes`][1].

Supports web and React Native. [See all storage providers.](#storage-providers)

[0]: https://github.com/apollographql/apollo-client/tree/master/src/cache/inmemory
[1]: https://github.com/convoyinc/apollo-cache-hermes

## Basic Usage

To get started, simply pass your Apollo cache and an
[underlying storage provider](#storage-providers) to `persistCache`.

By default, the contents of your Apollo cache will be immediately restored
(asynchronously, see [how to persist data before rendering](#how-do-i-wait-for-the-cache-to-be-restored-before-rendering-my-app)), and will be persisted upon every write to the cache (with a
short debounce interval).

### Examples

#### React Native

```js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InMemoryCache } from '@apollo/client/core';
import { persistCache, AsyncStorageWrapper } from 'apollo3-cache-persist';

const cache = new InMemoryCache({...});

// await before instantiating ApolloClient, else queries might run before the cache is persisted
await persistCache({
  cache,
  storage: new AsyncStorageWrapper(AsyncStorage),
});

// Continue setting up Apollo as usual.

const client = new ApolloClient({
  cache,
  ...
});
```

See a complete example in the [React Native example](./examples/react-native/App.tsx).

#### Web

```js
import { InMemoryCache } from '@apollo/client/core';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

const cache = new InMemoryCache({...});

// await before instantiating ApolloClient, else queries might run before the cache is persisted
await persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

// Continue setting up Apollo as usual.

const client = new ApolloClient({
  cache,
  ...
});
```

See a complete example in the [web example](./examples/web/src/index.tsx).

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

Take a look at the [examples](./examples/react-native/src/utils/persistence/persistenceMapper.ts)
and [it's corresponding documentation](./examples/react-native/src/utils/persistence/README.md)

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

`apollo3-cache-persist` provides wrappers for the following storage providers, with no additional dependencies:

| Storage provider | Platform	| Wrapper class	|
|---	|---	|---	|
| [`AsyncStorage`](https://github.com/react-native-async-storage/async-storage)*	| React Native	| `AsyncStorageWrapper`	|
| `window.localStorage`	| web	| `LocalStorageWrapper`	|
| `window.sessionStorage`	| web	| `SessionStorageWrapper`	|
| [`localForage`](https://github.com/localForage/localForage)	| web	| `LocalForageWrapper`	|
| [`Ionic storage`](https://ionicframework.com/docs/building/storage)	| web and mobile	| `IonicStorageWrapper`	|
| [`MMKV Storage`](https://github.com/ammarahm-ed/react-native-mmkv-storage)	| React Native	| `MMKVStorageWrapper`	|

`apollo3-cache-persist` uses the same storage provider API as
[`redux-persist`](https://github.com/rt2zz/redux-persist), so you can also make
use of the providers
[listed here](https://github.com/rt2zz/redux-persist#storage-engines),
including:

- [`redux-persist-node-storage`](https://github.com/pellejacobs/redux-persist-node-storage)
- [`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage)
- [`redux-persist-cookie-storage`](https://github.com/abersager/redux-persist-cookie-storage)

*`AsyncStorage`
[does not support](https://github.com/facebook/react-native/issues/12529#issuecomment-345326643)
individual values in excess of 2 MB on Android. If you set `maxSize` to more than 2 MB or to `false`,
use a different storage provider, such as
[`react-native-mmkv-storage`](https://github.com/ammarahm-ed/react-native-mmkv-storage) or
[`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage).

### Using other storage providers

`apollo3-cache-persist` supports stable versions of storage providers mentioned above.
If you want to use other storage provider, or there's a breaking change in `next` version of supported provider,
you can create your own wrapper. For an example of a simple wrapper have a look at [`AsyncStorageWrapper`](./src/storageWrappers/AsyncStorageWrapper.ts).

If you found that stable version of supported provider is no-longer compatible, please [submit an issue or a Pull Request](https://github.com/apollographql/apollo-cache-persist/blob/master/CONTRIBUTING.md#issues).

## Common Questions

#### Why is the 'background' trigger only available for React Native?

Quite simply, because mobile apps are different from web apps.

Mobile apps are rarely terminated before transitioning to the background. This
is helped by the fact that an app is moved to the background whenever the user
returns home, activates the multitasking view, or follows a link to another app.
There's almost always an opportunity to persist.

On web, we _could_ support a 'background' trigger with the
[Page Visibility API](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API);
however, data would be lost if the user closed the tab/window directly. Given
this prevalence of this user behavior and the substantially better performance
of the 'write' trigger on web, we've omitted a 'background' trigger on web.

#### How do I wait for the cache to be restored before rendering my app?

`persistCache` (as well as `persistor.restore()`) returns a promise that will
resolve once the cache has been restored, which you can await before rendering
your app.

This library, like Apollo Client, is framework agnostic; however, since many
people have asked, here's an example of how to handle this in React. PRs with
examples from other frameworks are welcome.

You can find all examples in the [examples](./examples/) directory.

##### React Using Hooks

```js
import React, {useEffect, useState} from 'react';

import {ApolloClient, ApolloProvider,} from '@apollo/client';
import {InMemoryCache} from '@apollo/client/core';
import {LocalStorageWrapper, persistCache} from 'apollo3-cache-persist';

const App = () => {
    const [client, setClient] = useState();

    useEffect(() => {
        async function init() {
            const cache = new InMemoryCache();
            await persistCache({
                cache,
                storage: new LocalStorageWrapper(window.localStorage),
            })
            setClient(
                new ApolloClient({
                    cache,
                }),
            );
        }

        init().catch(console.error);
    }, []);

    if (!client) {
      return <h2>Initializing app...</h2>;
    }

    return (
        <ApolloProvider client={client}>
            {/* the rest of your app goes here */}
        </ApolloProvider>
    );
};

export default App;
```

#### Using Synchronous Storage API

`persistCache` method is asynchronous to conform to production ready storage interfaces
which offer only asynchronous API.

apollo-cache-persist offers alternative `persistCacheSync` method that should be used only with small cache sizes and synchronous storage provider (e.g. window.localStorage). `persistCacheSync` is best suited for demo applications because it blocks UI rendering until the cache is restored.

```js
import { InMemoryCache } from '@apollo/client/core';
import { persistCacheSync, LocalStorageWrapper } from 'apollo3-cache-persist';

const cache = new InMemoryCache({...});

persistCacheSync({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
});
```

`persistCacheSync` works by instantiating subclasses of `CachePeristor`, `Persistor`, and `Storage` that implement a method for restoring the cache synchronously.

#### I need to ensure certain data is not persisted. How do I filter my cache?

You can optionally pass a `persistenceMapper` function to the `CachePersistor` which
will allow you to control what parts of the Apollo Client cache get persisted. Please
refer to the [Advanced Usage of the `CachePersistor`](#using-cachepersistor) for more
details.

Other alternatives have been recommended in
[#2](https://github.com/apollographql/apollo3-cache-persist/issues/2#issuecomment-350823835),
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

#### I've had a breaking schema change. How do I migrate or purge my cache?

For the same reasons given in the preceding answer, it's not possible to migrate
or transform your persisted cache data. However, by using the
[methods on `CachePersistor`](#using-cachepersistor), it's simple to reset the
cache upon changes to the schema.

Simply instantiate a `CachePersistor` and only call `restore()` if the app's
schema hasn't change. (You'll need to track your schema version yourself.)

Here's an example of how this could look:

```js
import AsyncStorage from '@react-native-community/async-storage';
import { InMemoryCache } from '@apollo/client/core';
import { CachePersistor, AsyncStorageWrapper } from 'apollo3-cache-persist';

const SCHEMA_VERSION = '3'; // Must be a string.
const SCHEMA_VERSION_KEY = 'apollo-schema-version';

async function setupApollo() {
  const cache = new InMemoryCache({...});

  const persistor = new CachePersistor({
    cache,
    storage: new AsyncStorageWrapper(AsyncStorage),
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

This is the result of a 2 MB per key limitation of `AsyncStorage` on Android.
Set a smaller `maxSize` or switch to a different storage provider, such
as
[`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage) or [`react-native-mmkv-storage`](https://github.com/ammarahm-ed/react-native-mmkv-storage).

#### Cache persist and changing user context

In some cases like user logout we want to wipe out application cache.
To do it effectively with Apollo Cache Persist please use `client.clearStore()` method that will
eventually reset persistence layer.
