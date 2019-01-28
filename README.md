# apollo-cache-persist-encrypt

This repository is a fork from [apollographql/apollo-cache-persist](https://github.com/apollographql/apollo-cache-persist) and extends Apollo Persist Options to accept encryptionKey.

## Basic Usage

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
  encryptionKey: 'my-super-secret-key' // here
});

// Continue setting up Apollo as usual.

const client = new ApolloClient({
  cache,
  ...
});
```
