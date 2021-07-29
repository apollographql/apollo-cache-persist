# Release

The standard release command for this project is:

```sh
yarn version [--new-version <version> | --major | --minor | --patch]
```

This command will:

1. Generate/update the Changelog
1. Bump the package version
1. Tag & pushing the commit
1. Publish the package to NPM (assuming you are logged in to NPM and have the correct access)

e.g.

```sh
yarn version --patch // 1.0.0 -> 1.0.1
```
