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
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  gql,
  useQuery,
} from '@apollo/client';

const shipsGQL = gql`
  query ShipsQuery {
    ships(limit: 10) {
      id
      name
      type
      home_port
    }
  }
`;

type ShipsQuery = {
  ships: {
    id: string;
    name: string;
    type: string;
    home_port: string;
  }[];
}

export const Ships = () => {
  const {error, data, loading} = useQuery<ShipsQuery>(shipsGQL, {
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
      {data.ships.map(ship => (
        <View key={ship.id} style={styles.item}>
          <Text>{ship.name}</Text>
          <Text style={styles.subtitle}>
            {ship.type}, {ship.home_port}
          </Text>
        </View>
      ))}
    </ScrollView>
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
  subtitle: {
    fontSize: 12,
  },
});
