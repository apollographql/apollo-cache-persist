# Persistence Mapper Example

The example persistence mapper uses the same strategy as
[apollo-cache-instorage](https://github.com/TallerWebSolutions/apollo-cache-instorage)
and largely just copied the `PersistLink` from it.

Effectively you can decorate your queries with either the `@persist` directive
or the `__persist` property in order to flag the query and objects for persistence.
In order to make this possible you need to add the persist link to your apollo
clients' link chain (see the `useApolloClient` hook). The persist links'
responsibility is to strip the `@persist`/`__persist` tags from your query prior
to it being sent to your graphql endpoint and then decorating the response from
the query with those attributes.

Once that's completed the `persistenceMapper` simply parses the local cache and
strips out any elements that don't have those properties on them from the
persisted version of the cache.

#### Example

```gql
query FooQuery {
  foos @persist {
    id
    name
    description
  }
}
```

or

```gql
query FooQuery {
  foos {
    __persist
    id
    name
    description
  }
}
```

You can see this in action in the `src/Launches.tsx` and `src/Ships.tsx` components.
`launchesGQL` is decorated and therefore will be persisted whereas `shipsGQL` is
not (so it won't be persisted).
