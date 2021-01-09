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
} from '@apollo/client';
import {AsyncStorageWrapper, CachePersistor} from 'apollo3-cache-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

const launchesGQL = gql`
  query LaunchesQuery {
    launches(limit: 10) {
      id
      mission_name
      details
      launch_date_utc
    }
  }
`;

type LaunchesQuery = {
  launches: {
    id: string;
    mission_name: string;
    details: string;
    launch_date_utc: string;
  }[];
};

const Launches = () => {
  const {error, data, loading} = useQuery<LaunchesQuery>(launchesGQL, {
    fetchPolicy: 'cache-and-network',
  });

  if (!data) {
    // we don't have data yet

    if (loading) {
      // but we're loading some
      return <Text style={styles.heading}>Loading initial data...</Text>;
    }
    if (error) {
      // and we have an error
      return <Text style={styles.heading}>Error loading data :(</Text>;
    }
    return <Text style={styles.heading}>Unknown error :(</Text>;
  }

  return (
    <ScrollView>
      {loading ? (
        <Text style={styles.heading}>Loading fresh data...</Text>
      ) : null}
      {data.launches.map(launch => (
        <View key={launch.id} style={styles.item}>
          <Text style={styles.mission}>{launch.mission_name}</Text>
          <Text style={styles.launchDate}>
            {new Date(launch.launch_date_utc).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const App = () => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject>>();
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
      });
      await newPersistor.restore();
      setPersistor(newPersistor);
      setClient(
        new ApolloClient({
          uri: 'https://api.spacex.land/graphql',
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
          <Launches />
        </View>
        <View style={styles.controls}>
          <Button title={'Clear cache'} onPress={clearCache} />
          <Button title={'Reload app (requires dev mode)'} onPress={reload} />
        </View>
      </SafeAreaView>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  heading: {
    padding: 16,
    fontWeight: 'bold',
  },
  item: {
    padding: 16,
  },
  mission: {},
  launchDate: {
    fontSize: 12,
  },
  content: {flex: 1},
  controls: {flex: 0},
});

export default App;
