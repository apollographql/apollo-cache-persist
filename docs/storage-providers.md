## Storage Providers

- [Natively Supported Providers](#natively-supported-providers)
- [Redux Persist Providers](#redux-persist-providers)
- [`AsyncStorage` Caveat](#asyncstorage-caveat)
- [Using other storage providers](#using-other-storage-providers)

## Natively Supported Providers

`apollo3-cache-persist` provides wrappers for the following storage providers, with no additional dependencies:

| Storage provider                                                                | Platform       | Wrapper class           |
| ------------------------------------------------------------------------------- | -------------- | ----------------------- |
| [`AsyncStorage`](https://github.com/react-native-async-storage/async-storage)\* | React Native   | `AsyncStorageWrapper`   |
| `window.localStorage`                                                           | web            | `LocalStorageWrapper`   |
| `window.sessionStorage`                                                         | web            | `SessionStorageWrapper` |
| [`localForage`](https://github.com/localForage/localForage)                     | web            | `LocalForageWrapper`    |
| [`Ionic storage`](https://ionicframework.com/docs/building/storage)             | web and mobile | `IonicStorageWrapper`   |
| [`MMKV Storage`](https://github.com/ammarahm-ed/react-native-mmkv-storage)      | React Native   | `MMKVStorageWrapper`    |
| [`MMKV`](https://github.com/mrousavy/react-native-mmkv)                         | React Native   | `MMKVWrapper`           |


## Redux Persist Providers
`apollo3-cache-persist` uses the same storage provider API as
[`redux-persist`](https://github.com/rt2zz/redux-persist), so you can also make
use of the providers
[listed here](https://github.com/rt2zz/redux-persist#storage-engines),
including:

- [`redux-persist-node-storage`](https://github.com/pellejacobs/redux-persist-node-storage)
- [`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage)
- [`redux-persist-cookie-storage`](https://github.com/abersager/redux-persist-cookie-storage)


## `AsyncStorage` Caveat
\*`AsyncStorage`
[does not support](https://github.com/facebook/react-native/issues/12529#issuecomment-345326643)
individual values in excess of 2 MB on Android. If you set `maxSize` to more than 2 MB or to `false`,
use a different storage provider, such as
[`react-native-mmkv-storage`](https://github.com/ammarahm-ed/react-native-mmkv-storage) or
[`redux-persist-fs-storage`](https://github.com/leethree/redux-persist-fs-storage).

## Using other storage providers

`apollo3-cache-persist` supports stable versions of storage providers mentioned above.
If you want to use other storage provider, or there's a breaking change in `next` version of supported provider,
you can create your own wrapper. For an example of a simple wrapper have a look at [`AsyncStorageWrapper`](/src/storageWrappers/AsyncStorageWrapper.ts).

If you found that stable version of supported provider is no-longer compatible, please [submit an issue or a Pull Request](https://github.com/apollographql/apollo-cache-persist/blob/master/CONTRIBUTING.md#issues).
