/**
 * Taken from https://github.com/TallerWebSolutions/apollo-cache-instorage
 */
import { visit } from 'graphql';
import { ApolloLink } from '@apollo/client';
import traverse from 'traverse';

import { extractPersistDirectivePaths } from './transform';

/**
 * Given a data result object path, return the equivalent query selection path.
 *
 * @param {Array} path The data result object path. i.e.: ["a", 0, "b"]
 * @return {String} the query selection path. i.e.: "a.b"
 */
const toQueryPath = (path: any[]) => path.filter(key => isNaN(Number(key))).join('.')

/**
 * Given a data result object, attach __persist values.
 */
const attachPersists = (paths: any[], object: any) => {
  const queryPaths = paths.map(toQueryPath);

  return traverse(object).map(function () {
    if (
      !this.isRoot &&
      this.node &&
      typeof this.node === 'object' &&
      Object.keys(this.node).length &&
      !Array.isArray(this.node)
    ) {
      const path = toQueryPath(this.path)

      this.update({
        __persist: Boolean(
          queryPaths.find(
            queryPath =>
              queryPath.indexOf(path) === 0 || path.indexOf(queryPath) === 0
          )
        ),
        ...this.node
      })
    }
  })
}

class PersistLink extends ApolloLink {
  public directive: string = 'persist';

  /**
   * Link query requester.
   */
  request = (operation: any, forward: any) => {
    const { query, paths } = extractPersistDirectivePaths(
      operation.query,
      this.directive,
    );
    // Replace query with one without @persist directives.
    operation.query = query;

    // Remove requesting __persist fields.
    operation.query = visit(operation.query, {
      Field: ({ name: { value: name } }: any): any => {
        if (name === '__persist') {
          return null;
        }
      }
    })

    return forward(operation).map((result: any) => {
      if (result.data) {
        result.data = attachPersists(paths, result.data);
      }

      return result;
    })
  }
}

const createPersistLink = () => new PersistLink();

export { PersistLink, createPersistLink };
