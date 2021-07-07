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

const launchesGQL = gql`
  query LaunchesQuery {
    launches(limit: 10) @persist {
      id
      details
      mission_name
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

export const Launches = () => {
  const {error, data, loading} = useQuery<LaunchesQuery>(launchesGQL, {
    fetchPolicy: 'cache-first',
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
});
