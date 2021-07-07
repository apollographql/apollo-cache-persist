export const persistenceMapper = (data: any) => {
  const parsed = JSON.parse(data);

  const mapped = {};
  const persistEntities = [];
  const rootQuery = parsed['ROOT_QUERY'];

  mapped['ROOT_QUERY'] = Object.keys(rootQuery).reduce((obj, key) => {
    if (key === '__typename') return obj;

    if (/@persist$/.test(key)) {
      obj[key] = rootQuery[key];
      const entities = rootQuery[key].map(item => item.__ref);
      persistEntities.push(...entities);
    }

    return obj;
  }, { __typename: 'Query' });

  persistEntities.reduce((obj, key) => {
    obj[key] = parsed[key];
    return obj;
  }, mapped);

  return JSON.stringify(mapped);
};
