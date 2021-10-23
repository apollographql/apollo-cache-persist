# Frequently Asked Questions

- [Why is the 'background' trigger only available for React Native?](#why-is-the-background-trigger-only-available-for-React-Native)
- [How do I wait for the cache to be restored before rendering my app?](#how-do-i-wait-for-the-cache-to-be-restored-before-rendering-my-app)
- [React Using Hooks](#react-using-hooks)
- [Using Synchronous Storage API](#using-synchronous-storage-api)
- [I need to ensure certain data is not persisted. How do I filter my cache?](#i-need-to-ensure-certain-data-is-not-persisted-how-do-I-filter-my-cache)
- [I've had a breaking schema change. How do I migrate or purge my cache?](#ive-had-a-breaking-schema-change-how-do-i-migrate-or-purge-my-cache)
- [I'm seeing errors on Android.](#im-seeing-errors-on-android)
- [Cache persist and changing user context](#cache-persist-and-changing-user-context)

## Why is the 'background' trigger only available for React Native?

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

## How do I wait for the cache to be restored before rendering my app?

`persistCache` (as well as `persistor.restore()`) returns a promise that will
resolve once the cache has been restored, which you can await before rendering
your app.

This library, like Apollo Client, is framework agnostic; however, since many
people have asked, here's an example of how to handle this in React. PRs with
examples from other frameworks are welcome.

You can find all examples in the [examples](./examples/) directory.

## React Using Hooks

```js
import React, { useEffect, useState } from 'react';

import { ApolloClient, ApolloProvider } from '@apollo/client';
import { InMemoryCache } from '@apollo/client/core';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';

const App = () => {
  const [client, setClient] = useState();

  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
      });
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

## Using Synchronous Storage API

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

## I need to ensure certain data is not persisted. How do I filter my cache?

You can optionally pass a `persistenceMapper` function to the `CachePersistor` which
will allow you to control what parts of the Apollo Client cache get persisted. Please
refer to the [Advanced Usage of the `CachePersistor`](https://github.com/apollographql/apollo-cache-persist/blob/master/docs/advanced-usage.md#using-cachepersistor) for more
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

## I've had a breaking schema change. How do I migrate or purge my cache?

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

## I'm seeing errors on Android.

Specifically, this error:

```
BaseError: Couldn't read row 0, col 0 from CursorWindow.  Make sure the Cursor is initialized correctly before accessing data from it.
```

This is the result of a 2 MB per key limitation of `AsyncStorage` on Android.
Set a smaller `maxSize` or switch to a different storage provider, such
as
[`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage) or [`react-native-mmkv-storage`](https://github.com/ammarahm-ed/react-native-mmkv-storage).

## Cache persist and changing user context

In some cases like user logout we want to wipe out application cache.
To do it effectively with Apollo Cache Persist please use `client.clearStore()` method that will
eventually reset persistence layer.
