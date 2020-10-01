import React from 'react';
import { render } from 'react-dom';

import { ApolloProvider, ApolloClient } from '@apollo/client';
import { Query } from '@apollo/client/react/components';
import gql from 'graphql-tag';
import { InMemoryCache } from '@apollo/client/core';
import { CachePersistor } from 'apollo3-cache-persist';
import { PersistentStorage } from "apollo3-cache-persist/types";

let persistor;

class LocalStoragePersistedStorage implements PersistentStorage<string> {
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }

  setItem(key: string, data: any) {
    localStorage.setItem(key, data);
  }
}

async function createClient() {
  const cache = new InMemoryCache({});
  persistor = new CachePersistor({
    storage: new LocalStoragePersistedStorage(),
    cache,
  });
  await persistor.restore();
  return new ApolloClient({
    uri: 'https://48p1r2roz4.sse.codesandbox.io',
    cache,
  });
}

const ratesGQL = gql`
  {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

const ExchangeRates = () => (
  <Query query={ratesGQL} fetchPolicy="network-only">
    {(result) => {
      const { error, data, loading } = result;
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      return data.rates.map(({ currency, rate }) => (
        <div key={currency}>
          <p>
            {currency}: {rate}
          </p>
        </div>
      ));
    }}
  </Query>
);

createClient().then(client => {
  const App = () => (
    <ApolloProvider client={client}>
      <div>
        <h2>Cache Persist testing <span role="img" aria-label="rocket">🚀</span></h2>
        <ExchangeRates />
      </div>
    </ApolloProvider>
  );

  render(<App />, document.getElementById('root'));
  setTimeout(() => {
    // client.resetStore();
    // persistor.purge();
  }, 3000);
});
