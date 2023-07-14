<img src="./logo.png" style="display: block; margin: 0px auto; width: 300px;" />
<p style="text-align: center;"><b>ChartFox browser extension</b></p>

The ChartFox browser extension is an extension for Chromium-based browsers (Google Chrome, Microsoft Edge, etc.) and Firefox that integrates with the [ChartFox](https://chartfox.org/) web application to allow it to provide full support for aeronautical charts loaded from restrictive services.

## Rationale

Most websites, including the AIPs which ChartFox loads its charts from, have either no or restrictive [Cross-Origin Resource Sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) headers. The effect of this is that ChartFox is only able to display charts from these sources by directly including the webpage (with an `<iframe>`), which severely restricts our ability to make them integrate nicely.

CORS is a necessity and cannot be bypassed by websites on their own. Typically, this issue is circumvented by proxying the content through a first-party external server, however this is generally disallowed by sources. Alternatively, given CORS is a browser-implemented restriction, native applications (those installed directly on the system, instead of accessed through the browser) do not suffer from this issue &mdash; whilst this would be the most ideal solution, the browser extension effectively simulates this functionality (by adding its own `Access-Control-Allow-Origin` header to requests made by ChartFox) whilst being much simpler to create.

This also means that clients still load the charts directly from the supplier &mdash; pretty neat!

## Building

The extension is consists of the manifest JSON files (used by the browser) and a single content script which signals its presence to the ChartFox application. A build step is used to compile the content script (from TypeScript) and substitute the relevant domains into the manifests. Vite is used as the build tool, with environment variables used to configure settings.

To install dependencies and build the extension, run:

```
yarn
yarn build
```

The compiled extension is then available in the "dist/" directory.

### Default settings

The default environment variables are shown below:

```
# The domains used to make the requests (in dev, localhost)
VITE_INITIATOR_DOMAINS=chartfox.org,beta.chartfox.org

# The domains which will be requested (AIPs)
VITE_REQUEST_DOMAINS=*
```

These can be configured by a file named ".env" in the project root, making use of the same format as above.

## License

This source code has been made open-source in the effort for transparency (web extensions shouldn't be clouded in secrecy!). However, this code is still copyrighted and property of Cobalt Grid. Any contributions made to this repository are under the condition that the author assigns the copyright for their contribution to Cobalt Grid.
