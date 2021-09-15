# apollo3-cache-persist [![npm version](https://badge.fury.io/js/apollo3-cache-persist.svg)](https://badge.fury.io/js/apollo3-cache-persist) [![build status](https://travis-ci.org/apollographql/apollo-cache-persist.svg?branch=master)](https://travis-ci.org/apollographql/apollo-cache-persist) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

Simple persistence for all Apollo Client 3.0 cache implementations, including
[`InMemoryCache`][0] and [`Hermes`][1].

Supports web and React Native. [See all storage providers.](./docs/storage-providers.md)

[0]: https://github.com/apollographql/apollo-client/tree/master/src/cache/inmemory
[1]: https://github.com/convoyinc/apollo-cache-hermes


- [Basic Usage](#basic-usage)
  - [React Native](#react-native)
  - [Web](#web)
- [Storage Providers](./docs/storage-providers.md)
- [Advanced Usage](./docs/advanced-usage.md)
- [FAQ](./docs/faq.md)
- [Contributing](#contributing)
- [Maintainers](#maintainers)

## Basic Usage

```sh
npm install --save apollo3-cache-persist
```

or

```sh
yarn add apollo3-cache-persist
```

To get started, simply pass your Apollo cache and an
[underlying storage provider](./docs/storage-providers.md) to `persistCache`.

By default, the contents of your Apollo cache will be immediately restored
(asynchronously, see [how to persist data before rendering](./docs/faq.md#how-do-i-wait-for-the-cache-to-be-restored-before-rendering-my-app)), and will be persisted upon every write to the cache (with a
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

## Contributing

Want to make the project better? Awesome! Please read through our [Contributing Guidelines](./CONTRIBUTING.md).

## Maintainers

We all do this for free... so please be nice 😁.

- [@wtrocki](https://github.com/wtrocki)
- [@wodCZ](https://github.com/wodCZ)
- [@jspizziri](https://github.com/jspizziri)
