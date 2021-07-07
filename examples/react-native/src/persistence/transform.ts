/**
 * Taken from https://github.com/TallerWebSolutions/apollo-cache-instorage
 */
import { visit, BREAK } from 'graphql';
import { checkDocument, cloneDeep } from '@apollo/client';

const PERSIST_FIELD = {
  kind: 'Field',
  name: {
    kind: 'Name',
    value: '__persist'
  }
}

const addPersistFieldToSelectionSet = (selectionSet, isRoot = false) => {
  if (selectionSet.selections) {
    if (!isRoot) {
      const alreadyHasThisField = selectionSet.selections.some(selection => {
        return (
          selection.kind === 'Field' && selection.name.value === '__typename'
        )
      })

      if (!alreadyHasThisField) {
        selectionSet.selections.push(PERSIST_FIELD)
      }
    }

    selectionSet.selections.forEach(selection => {
      // Must not add __typename if we're inside an introspection query
      if (selection.kind === 'Field') {
        if (
          selection.name.value.lastIndexOf('__', 0) !== 0 &&
          selection.selectionSet
        ) {
          addPersistFieldToSelectionSet(selection.selectionSet)
        }
      }
      else if (selection.kind === 'InlineFragment') {
        if (selection.selectionSet) {
          addPersistFieldToSelectionSet(selection.selectionSet)
        }
      }
    })
  }
}

const addPersistFieldToDocument = doc => {
  checkDocument(doc)
  const docClone = cloneDeep(doc)

  docClone.definitions.forEach(definition => {
    const isRoot = definition.kind === 'OperationDefinition'
    addPersistFieldToSelectionSet(definition.selectionSet, isRoot)
  })

  return docClone
}

const extractPersistDirectivePaths = (originalQuery, directive = 'persist') => {
  const paths = []
  const fragmentPaths = {}
  const fragmentPersistPaths = {}

  const query = visit(originalQuery, {
    FragmentSpread: (
      { name: { value: name } },
      key,
      parent,
      path,
      ancestors
    ) => {
      const root = ancestors.find(
        ({ kind }) =>
          kind === 'OperationDefinition' || kind === 'FragmentDefinition'
      )

      const rootKey =
        root.kind === 'FragmentDefinition' ? root.name.value : '$ROOT'

      const fieldPath = ancestors
        .filter(({ kind }) => kind === 'Field')
        .map(({ name: { value: name } }) => name)

      fragmentPaths[name] = [rootKey].concat(fieldPath)
    },
    Directive: ({ name: { value: name } }, key, parent, path, ancestors) => {
      if (name === directive) {
        const fieldPath = ancestors
          .filter(({ kind }) => kind === 'Field')
          .map(({ name: { value: name } }) => name)

        const fragmentDefinition = ancestors.find(
          ({ kind }) => kind === 'FragmentDefinition'
        )

        // If we are inside a fragment, we must save the reference.
        if (fragmentDefinition) {
          fragmentPersistPaths[fragmentDefinition.name.value] = fieldPath
        }
        else if (fieldPath.length) {
          paths.push(fieldPath)
        }

        return null
      }
    }
  })

  // In case there are any FragmentDefinition items, we need to combine paths.
  if (Object.keys(fragmentPersistPaths).length) {
    visit(originalQuery, {
      FragmentSpread: (
        { name: { value: name } },
        key,
        parent,
        path,
        ancestors
      ) => {
        if (fragmentPersistPaths[name]) {
          let fieldPath = ancestors
            .filter(({ kind }) => kind === 'Field')
            .map(({ name: { value: name } }) => name)

          fieldPath = fieldPath.concat(fragmentPersistPaths[name])

          let fragment = name
          let parent = fragmentPaths[fragment][0]

          while (parent && parent !== '$ROOT' && fragmentPaths[parent]) {
            fieldPath = fragmentPaths[parent].slice(1).concat(fieldPath)
            parent = fragmentPaths[parent][0]
          }

          paths.push(fieldPath)
        }
      }
    })
  }

  return { query, paths }
}

const hasPersistDirective = doc => {
  let hasDirective = false

  visit(doc, {
    Directive: ({ name: { value: name } }) => {
      if (name === 'persist') {
        hasDirective = true
        return BREAK
      }
    }
  })

  return hasDirective
}

export {
  addPersistFieldToDocument,
  extractPersistDirectivePaths,
  hasPersistDirective
}
