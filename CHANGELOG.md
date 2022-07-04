## [0.14.1](https://github.com/apollographql/apollo-cache-persist/compare/0.14.0...0.14.1) (2022-07-04)


### Bug Fixes

* **types:** remove unused keys ([5e83d71](https://github.com/apollographql/apollo-cache-persist/commit/5e83d7100ddbe60b833be45df626558c9666ff30))



# [0.13.0](https://github.com/apollographql/apollo-cache-persist/compare/v0.12.1...v0.13.0) (2021-09-17)


### Features

* **MMKVWrapper:** Added new storage wrapper ([1b16bdb](https://github.com/apollographql/apollo-cache-persist/commit/1b16bdb00e896f62ee379777f7224a156e16004f))



## [0.12.1](https://github.com/apollographql/apollo-cache-persist/compare/v0.12.0...v0.12.1) (2021-08-12)


### Bug Fixes

* **types:** fix localforage interface ([63f7158](https://github.com/apollographql/apollo-cache-persist/commit/63f71582763b6895c05dd3897117cdfdbb0a70c3))



# [0.12.0](https://github.com/apollographql/apollo-cache-persist/compare/v0.11.0...v0.12.0) (2021-08-12)


### Bug Fixes

* **examples:** remove ts-ignore, fix peristenceMapper return type, apply codestyle ([c7619e2](https://github.com/apollographql/apollo-cache-persist/commit/c7619e2dfa6ac4971f845824466180d3c09d9c25))
* **examples:** use locally built library version instead of published ([8f21bf7](https://github.com/apollographql/apollo-cache-persist/commit/8f21bf79baba89ca2d4f57432ea2b8a928c9acc2))
* **types:** determine required storage type based on serialize option ([996c831](https://github.com/apollographql/apollo-cache-persist/commit/996c8315c1005c3030b9b814740616b3019daa7b))
* **types:** MMKV wrapper - remove undefined, normalize to null ([852de5f](https://github.com/apollographql/apollo-cache-persist/commit/852de5f5466f8b7fb2e24d94cc313b286c6bf3b6))
* **types:** provide simplistic storage interfaces ([56b1c55](https://github.com/apollographql/apollo-cache-persist/commit/56b1c5513505900b8bf87a289994d6fc3505ccd5)), closes [#426](https://github.com/apollographql/apollo-cache-persist/issues/426) [#431](https://github.com/apollographql/apollo-cache-persist/issues/431)



# [0.11.0](https://github.com/apollographql/apollo-cache-persist/compare/0.10.0...0.11.0) (2021-07-29)


### Bug Fixes

* **examples:** fix typescript compile issues in the react-native example project ([17b513b](https://github.com/apollographql/apollo-cache-persist/commit/17b513b97ef9fd06e3f6dc5d4c1cbd9ba16a52ab))


### Features

* **persistor:** add an optional persistence mapper function to allow cache filtration ([dc69b30](https://github.com/apollographql/apollo-cache-persist/commit/dc69b30f2241a7d5077ade116b6c89c21eedc2e5))



## [0.10.0](https://github.com/apollographql/apollo-cache-persist/compare/0.9.0...0.10.0) (2020-11-21)

### Features

- allow unserialised data to be written to store ([7bcb322](https://github.com/apollographql/apollo-cache-persist/commit/7bcb322a32aafb088afcf2c21c1ebe793409d8e3))

## [0.9.0](https://github.com/apollographql/apollo-cache-persist/compare/0.2.1...0.9.0) (2020-11-21)

### Bug Fixes

- add example to npm ignore ([45aff6e](https://github.com/apollographql/apollo-cache-persist/commit/45aff6ee38d8f95e9fcfeda74cde08e67913059b))
- add npm ignore to examples ([734c601](https://github.com/apollographql/apollo-cache-persist/commit/734c601274047bdf81e4015cdcc04604af4a0280))
- Apollo client peer dependency ([5436da4](https://github.com/apollographql/apollo-cache-persist/commit/5436da48269089a54b3a187b2e326f0443a2b5cf))
- do not purge in example app ([f45816f](https://github.com/apollographql/apollo-cache-persist/commit/f45816f5ea6377b44c6265ddb3ec72dc36df83a6))
- example app ([513e561](https://github.com/apollographql/apollo-cache-persist/commit/513e5614e2d5b25dee95b3f44b14a9e27f17b813))
- loosen apollo-client peer dep ([eeb0e9a](https://github.com/apollographql/apollo-cache-persist/commit/eeb0e9a74bc5c863af362203b44ac4c0b74b9c6b))
- loosen peer dependency ([67b83dd](https://github.com/apollographql/apollo-cache-persist/commit/67b83ddaa7fd1716a56f5f72faf999e7e06fa1cb))
- move examples to examples folder ([53d0d77](https://github.com/apollographql/apollo-cache-persist/commit/53d0d770b70bfefe8afbda33b14ffea0ad4e8ca5))
- rename package ([44009b8](https://github.com/apollographql/apollo-cache-persist/commit/44009b87f49aa97caf2453fc25c374d124c12aca))
- typings and compilation issues for RN example ([05dac9e](https://github.com/apollographql/apollo-cache-persist/commit/05dac9edcc1bae18e76d6fe3735b96ec4a786a46))

### Features

- Add trigger for cache.evict and cache.modify, return results of functions ([4881e28](https://github.com/apollographql/apollo-cache-persist/commit/4881e285c519f5bc6e033d3326f1d2cc36f1477d))

## [0.2.1](https://github.com/apollographql/apollo-cache-persist/compare/0.2.0...0.2.1) (2020-08-05)

### Bug Fixes

- export `PersistentStorage` type ([313fd06](https://github.com/apollographql/apollo-cache-persist/commit/313fd066413c613cdc5602cfb0d69bde34b34de4))
- export persistCacheSync explicitly ([755b94c](https://github.com/apollographql/apollo-cache-persist/commit/755b94cda510bc95c2357e71a803ee48b26284d2))
- improve logging for persisting information ([878b13b](https://github.com/apollographql/apollo-cache-persist/commit/878b13b080fed2670f2ceb7cdb8199a9d0072a39))
- minor typo ([a7c785e](https://github.com/apollographql/apollo-cache-persist/commit/a7c785ec958ab8139dfd4f040e578fdd6d207090))

### Features

- Add ionic support ([8cdf2d2](https://github.com/apollographql/apollo-cache-persist/commit/8cdf2d2483bd34ccaa43eef8522b616f981ab7db))

## [0.2.0](https://github.com/apollographql/apollo-cache-persist/compare/0.0.1...0.2.0) (2019-10-23)

### Features

- Synchronous api
- Storage bugfixing
- Package updates and testing for storage solutions

## 0.0.1 (2017-12-01)
