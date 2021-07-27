/**
 * Taken from https://github.com/TallerWebSolutions/apollo-cache-instorage
 */
import { visit } from 'graphql';
import { checkDocument, cloneDeep } from '@apollo/client/utilities';

const PERSIST_FIELD = {
  kind: 'Field',
  name: {
    kind: 'Name',
    value: '__persist',
  },
};

const addPersistFieldToSelectionSet = (selectionSet: any, isRoot: boolean = false) => {
  if (selectionSet.selections) {
    if (!isRoot) {
      const alreadyHasThisField = selectionSet.selections.some((selection: any) => {
        return (
          selection.kind === 'Field' && selection.name.value === '__typename'
        );
      })

      if (!alreadyHasThisField) {
        selectionSet.selections.push(PERSIST_FIELD);
      }
    }

    selectionSet.selections.forEach((selection: any) => {
      // Must not add __typename if we're inside an introspection query
      if (selection.kind === 'Field') {
        if (
          selection.name.value.lastIndexOf('__', 0) !== 0 &&
          selection.selectionSet
        ) {
          addPersistFieldToSelectionSet(selection.selectionSet);
        }
      }
      else if (selection.kind === 'InlineFragment') {
        if (selection.selectionSet) {
          addPersistFieldToSelectionSet(selection.selectionSet);
        }
      }
    })
  }
}

const addPersistFieldToDocument = (doc: any) => {
  checkDocument(doc);
  const docClone = cloneDeep(doc);

  docClone.definitions.forEach((definition: any) => {
    const isRoot = definition.kind === 'OperationDefinition'
    addPersistFieldToSelectionSet(definition.selectionSet, isRoot)
  });

  return docClone;
}

const extractPersistDirectivePaths = (originalQuery: any, directive: string = 'persist') => {
  const paths: any[] = [];
  const fragmentPaths: any = {};
  const fragmentPersistPaths: any = {};

  const query = visit(originalQuery, {
    FragmentSpread: (
      { name: { value: name } }: any,
      // ts complains about these not being used, however they're positional
      // parameters, so we can't remove them due to ancestors being needed.
      // @ts-ignore
      key: any, parent: any, path: any,
      ancestors: any,
    ): any => {
      const root = ancestors.find(
        ({ kind }: any) =>
          kind === 'OperationDefinition' || kind === 'FragmentDefinition'
      );

      const rootKey =
        root.kind === 'FragmentDefinition' ? root.name.value : '$ROOT';

      const fieldPath = ancestors
        .filter(({ kind }: any) => kind === 'Field')
        .map(({ name: { value: name } }: any) => name);

      fragmentPaths[name] = [rootKey].concat(fieldPath);
    },
    Directive: (
      { name: { value: name } }: any,
      // ts complains about these not being used, however they're positional
      // parameters, so we can't remove them due to ancestors being needed.
      // @ts-ignore
      key: any, parent: any, path: any,
      ancestors: any,
    ): any => {
      if (name === directive) {
        const fieldPath = ancestors
          .filter(({ kind }: any) => kind === 'Field')
          .map(({ name: { value: name } }: any) => name);

        const fragmentDefinition = ancestors.find(
          ({ kind }: any) => kind === 'FragmentDefinition'
        );

        // If we are inside a fragment, we must save the reference.
        if (fragmentDefinition) {
          fragmentPersistPaths[fragmentDefinition.name.value] = fieldPath;
        }
        else if (fieldPath.length) {
          paths.push(fieldPath);
        }

        return null;
      }
    }
  })

  // In case there are any FragmentDefinition items, we need to combine paths.
  if (Object.keys(fragmentPersistPaths).length) {
    visit(originalQuery, {
      FragmentSpread: (
        { name: { value: name } }: any,
        // ts complains about these not being used, however they're positional
        // parameters, so we can't remove them due to ancestors being needed.
        // @ts-ignore
        key: any, parent: any, path: any,
        ancestors: any
      ) => {
        if (fragmentPersistPaths[name]) {
          let fieldPath = ancestors
            .filter(({ kind }: any) => kind === 'Field')
            .map(({ name: { value: name } }: any) => name);

          fieldPath = fieldPath.concat(fragmentPersistPaths[name]);

          let fragment = name;
          let parent = fragmentPaths[fragment][0];

          while (parent && parent !== '$ROOT' && fragmentPaths[parent]) {
            fieldPath = fragmentPaths[parent].slice(1).concat(fieldPath);
            parent = fragmentPaths[parent][0];
          }

          paths.push(fieldPath);
        }
      }
    });
  }

  return { query, paths };
}

export {
  addPersistFieldToDocument,
  extractPersistDirectivePaths,
}
