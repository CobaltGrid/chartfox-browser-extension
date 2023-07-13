# ChartFox Browser Extension

The ChartFox browser extension is an extension for Chromium-based browsers (Google Chrome, Microsoft Edge, etc.) and Firefox that integrates with the [ChartFox](https://chartfox.org/) web application to allow it to provide full support for aeronautical charts loaded from restrictive services.

## Rationale

Most websites, including the AIPs which ChartFox loads its charts from, have either no or restrictive [Cross-Origin Resource Sharing (CORS)](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing) headers. The effect of this is that ChartFox is only able to display charts from these sources by directly including the webpage (with an `<iframe>`), which severely restricts our ability to make them integrate nicely.

CORS is a necessity and cannot be bypassed by websites on their own. Typically, this issue is circumvented by proxying the content through a first-party external server, however this is dubious in terms of copyright legality. Alternatively, given CORS is a browser-implemented restriction, native applications do not suffer from this issue &mdash; whilst this would be the most ideal solution, the browser extension effectively simulates this functionality (by adding its own `Access-Control-Allow-Origin` header to requests made by ChartFox) whilst being much simpler to create.

This also means that clients still load the charts directly from the supplier &mdash; pretty neat!

## Build instructions

The extension is very simple, consisting only of the two manifest JSON files and a single content script which signals its presence to the ChartFox application. As such, the build consists only of compiling the content script (from TypeScript) and then substituting the relevant domains into the manifests. It makes use of a simple Vite configuration, with the domains being taken from environment variables.

Once the repository is cloned, the first step to building is installing the required dependencies by running `yarn`. Building is then done by `yarn build`, with the output extension in the "dist/" directory.

The default environment variables are as follows, shown in the syntax used to customise them when entered into the ".env" file in the root:

```ini
# The domains used to make the requests (in dev, localhost)
VITE_INITIATOR_DOMAINS=chartfox.org,beta.chartfox.org

# The domains which will be requested (AIPs)
# Defaults to "*", but should be made more specific in actual builds
VITE_REQUEST_DOMAINS=*
```

## License

This source code has been made open-source in the effort for transparency (web extensions shouldn't be clouded in secrecy!). However, this code is still copyrighted and property of Cobalt Grid. Any contributions made to this repository are under the condition that the author assigns the copyright for their contribution to Cobalt Grid.
