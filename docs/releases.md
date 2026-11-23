# npm releases

Publish as `@ohtf/nhs-number-js`. Use Node 24 with npm 11.15 or later for staging. The library itself supports Node 22.13 and later.

## First release

npm requires an existing package before you can add a trusted publisher. [Staging a new package](https://docs.npmjs.com/staged-publishing/) creates a public `0.0.0-stage` placeholder, but the actual tarball stays private until an npm maintainer approves it with 2FA. No automation token is needed.

From a clean checkout of the reviewed release commit, sign in with an npm account that can publish for `@ohtf`:

```sh
npm login --registry=https://registry.npmjs.org/
npm ci --ignore-scripts
s/test
npm pack --dry-run --ignore-scripts
npm stage publish --access public --ignore-scripts
```

Open **Staged Packages** on npmjs.com. Verify the package name, version and contents, then approve with 2FA. To approve in a terminal, use `npm stage approve <stage-id>`. If you don't need a review step, `npm publish --access public --ignore-scripts` also bootstraps the package, but releases the version immediately.

## Set up Trusted Publishing

1. Land `.github/workflows/npm-publish.yml` on `main`. In GitHub, create the `npm` environment, restrict deployments to `main`, and require a maintainer to approve deployments. Keep CI required on `main`.
2. In [the package’s npm access settings](https://www.npmjs.com/package/@ohtf/nhs-number-js/access), add a GitHub Actions trusted publisher: organisation `ohtf`, repository `nhs-number-js`, workflow filename `npm-publish.yml`, environment `npm`. Leave direct publishing and dist-tag changes disabled. Staging is allowed by default for new configurations.
3. Add the configuration when the next version is ready to release. npm requires a first successful use within two days. After a successful Trusted Publishing release, set publishing access to **Require two-factor authentication and disallow tokens**.

## Stage subsequent releases

Land a version bump in `package.json` and `package-lock.json` on protected `main`, then run **Stage npm release** from `main` in GitHub Actions. Approve the `npm` deployment and then approve the staged version on npm. The build job tests and packs without publishing credentials; only the staging job can request an OIDC token. No npm secret is stored in GitHub.

The initial npm workflow uses explicit dispatch rather than auto-tagging: the first release needs a registry bootstrap, and later releases need a deliberate staging request while this project is new. Do not tag or publish a local build as part of the normal Trusted Publishing flow. See [npm’s Trusted Publishing documentation](https://docs.npmjs.com/trusted-publishers/).
