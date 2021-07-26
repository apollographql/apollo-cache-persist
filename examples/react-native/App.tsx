/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useCallback, useState } from 'react';
import {
  Button,
  DevSettings,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ApolloProvider } from '@apollo/client';

import { Launches } from './src/Launches';
import { Ships } from './src/Ships';

import { useApolloClient } from './src/hooks';

const App = () => {
  const [display, setDisplay] = useState<number>(0);
  const { client, clearCache } = useApolloClient();

  const reload = useCallback(() => {
    DevSettings.reload();
  }, []);

  if (!client) {
    return <Text>Initializing app...</Text>;
  }

  return (
    <ApolloProvider client={client}>
      <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
        <View style={styles.content}>
          {display % 2 === 0 ? <Launches /> : <Ships />}
        </View>
        <View style={styles.controls}>
          <Button title={`Show ${display % 2 ? 'Launches' : 'Ships'}`} onPress={() => setDisplay(display + 1)} />
          <Button title={'Clear cache'} onPress={clearCache} />
          <Button title={'Reload app (requires dev mode)'} onPress={reload} />
        </View>
      </SafeAreaView>
    </ApolloProvider>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1 },
  controls: { flex: 0 },
});

export default App;
