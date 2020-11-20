/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, Text } from 'react-native';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { persistCache, AsyncStorageWrapper } from 'apollo3-cache-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { gql } from '@apollo/client';

import { Colors } from 'react-native/Libraries/NewAppScreen';

const App = () => {
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function init() {
      const cache = new InMemoryCache();
      await persistCache({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
      });
      const client = new ApolloClient({
        uri: 'https://48p1r2roz4.sse.codesandbox.io',
        cache: new InMemoryCache(),
      });
      try {
        const { data } = await client.query({
          query: gql`
            query GetRates {
              rates(currency: "USD") {
                currency
              }
            }
          `,
        });

        //@ts-ignore type this
        setCurrencies(data.rates);
      } catch (e) {
        setError(e.message);
      }
    }
    init();
  }, []);

  return (
    <>
      <SafeAreaView>
        {error ? (
          <Text style={{ padding: 16, fontWeight: 'bold' }}>{error}</Text>
        ) : (
            <>
              <Text style={{ padding: 16, fontWeight: 'bold' }}>
                List of currencies
            </Text>
              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={styles.scrollView}>
                {currencies.map((item: any, index: any) => (
                  //@ts-ignore type it
                  <Text key={item.currency + String(index)} style={{ padding: 16 }}>
                    {item.currency}
                  </Text>
                ))}
              </ScrollView>
            </>
          )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

export default App;
