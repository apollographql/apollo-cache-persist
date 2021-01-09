import React, { useCallback, useEffect, useState } from 'react';
import { render } from 'react-dom';

import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
  useQuery,
} from '@apollo/client';
import gql from 'graphql-tag';
import { InMemoryCache } from '@apollo/client/core';
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist';
import styles from './index.module.css';

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
  const { error, data, loading } = useQuery<LaunchesQuery>(launchesGQL, {
    fetchPolicy: 'cache-and-network',
  });

  if (!data) {
    // we don't have data yet

    if (loading) {
      // but we're loading some
      return <h2>Loading initial data...</h2>;
    }
    if (error) {
      // and we have an error
      return <h2>Error loading data :(</h2>;
    }
    return <h2>Unknown error :(</h2>;
  }

  return (
    <div>
      {loading ? <h2>Loading fresh data...</h2> : null}
      {data.launches.map(launch => (
        <div key={launch.id} className={styles.item}>
          <span>{launch.mission_name}</span>
          <br />
          <small>{new Date(launch.launch_date_utc).toLocaleString()}</small>
        </div>
      ))}
    </div>
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
        storage: new LocalStorageWrapper(window.localStorage),
        debug: true,
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

    init().catch(console.error);
  }, []);

  const clearCache = useCallback(() => {
    if (!persistor) {
      return;
    }
    persistor.purge();
  }, [persistor]);

  const reload = useCallback(() => {
    window.location.reload();
  }, []);

  if (!client) {
    return <h2>Initializing app...</h2>;
  }

  return (
    <ApolloProvider client={client}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Launches />
        </div>
        <div className={styles.controls}>
          <h3>Example controls</h3>
          <p>Use the following buttons to control apollo3-cache-persist.</p>
          <p>
            Once you've loaded the initial data, you should see "Loading fresh
            data" followed by the list of cached Launches every time you reload
            the page.
          </p>
          <p>
            Clear cache should remove everything from the localstorage, so that
            when you reload the page, you should see "Loading initial data..."
            for a moment.
          </p>
          <p>
            Debugging output is enabled,{' '}
            <strong>make sure to open Developer console</strong> to see what's
            going on. You can see the cached data under{' '}
            <i>Application &rarr; Local Storage</i>.
          </p>
          <button onClick={clearCache}>Clear cache</button>
          <button onClick={reload}>Reload page</button>
        </div>
      </div>
    </ApolloProvider>
  );
};

render(<App />, document.getElementById('root'));
