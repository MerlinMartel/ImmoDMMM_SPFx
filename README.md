## immo-dmmm-sp-fx

This is where you include your WebPart documentation.

Node version 8.9.0

Need : https://github.com/SharePoint/sp-dev-docs/issues/1002 


### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

### Build options

npm run dev (GULP serve fonctionne pas avec la nouvelle version de node)
