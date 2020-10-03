import React from 'react';
import { render } from 'react-dom';

import { ApolloProvider, ApolloClient, useQuery, makeVar, useReactiveVar } from '@apollo/client';
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

const selectedCurrenciesVar = makeVar<String[]>([]);

const ExchangeRates = () => {
  const selectedItems: String[] = useReactiveVar(selectedCurrenciesVar);
  const { error, data, loading } = useQuery(ratesGQL, { fetchPolicy: "network-only" });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  const toggleSelectedCurrency = (currency) => {
    let newSelectedItems: String[] = [];

    if (selectedItems.some(i => i === currency))
      newSelectedItems = selectedItems.filter(i => i !== currency);
    else
      newSelectedItems = [...selectedItems, currency]

    selectedCurrenciesVar(newSelectedItems);
  }

  return data.rates.map(({ currency, rate }) => {
    const isCurrencySelected = selectedItems.some(i => i === currency);

    return (
      <div key={currency}>
        <label>
          <input
            checked={isCurrencySelected}
            type="checkbox" id="currency" name="currency"
            onChange={() => toggleSelectedCurrency(currency)}
          />
          {`${currency}: ${rate}`}
        </label>
      </div>
    )
  });
};

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
