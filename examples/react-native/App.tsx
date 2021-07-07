/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Button,
  DevSettings,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ApolloClient,
  ApolloProvider,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
  useQuery,
  createHttpLink,
} from '@apollo/client';
import {AsyncStorageWrapper, CachePersistor} from 'apollo3-cache-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Launches } from './src/Launches';
import { Ships } from './src/Ships';
import { persistenceMapper, createPersistLink } from './src/persistence';

const App = () => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
  const [display, setDisplay] = useState<number>(0);
  const [persistor, setPersistor] = useState<
    CachePersistor<NormalizedCacheObject>
  >();

  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache();
      let newPersistor = new CachePersistor({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
        debug: __DEV__,
        trigger: 'write',
        persistenceMapper,
      });
      await newPersistor.restore();
      setPersistor(newPersistor);
      const persistLink = createPersistLink();
      const httpLink = createHttpLink({ uri: 'https://api.spacex.land/graphql' });
      setClient(
        new ApolloClient({
          link: persistLink.concat(httpLink),
          cache,
        }),
      );
    }

    init();
  }, []);

  const clearCache = useCallback(() => {
    if (!persistor) {
      return;
    }
    persistor.purge();
  }, [persistor]);

  const reload = useCallback(() => {
    DevSettings.reload();
  }, []);

  if (!client) {
    return <Text style={styles.heading}>Initializing app...</Text>;
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={{...StyleSheet.absoluteFillObject}}>
        <View style={styles.content}>
          {display % 2 === 0 ? <Launches /> : <Ships />}
        </View>
        <View style={styles.controls}>
          <Button title={`Show ${display  % 2 ? 'Launches' : 'Ships' }`} onPress={() => setDisplay(display + 1)} />
          <Button title={'Clear cache'} onPress={clearCache} />
          <Button title={'Reload app (requires dev mode)'} onPress={reload} />
        </View>
      </SafeAreaView>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  content: {flex: 1},
  controls: {flex: 0},
});

export default App;
