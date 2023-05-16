<p align="center">
  <img src="./src/images/chartfox-logo.png" style="width: 300px">
</p>
<p align="center"><b >Chromium Browser Extension</b></p>
  
## About
The ChartFox chromium browser extension is an extension for Chromium-based browsers (e.g. Google Chrome, Microsoft Edge, etc.) that integrates with the [ChartFox](https://chartfox.org) web application to enable Cross-Origin resource requests to be allowed when loading aeronautical charts.

## Why this is required
Most websites, including AIPs, either have no or restrictive CORS (Cross-Origin Resource Sharing) headers. The effect of this is that ChartFox is only able to display charts from the majority of sources inside an iframe, which severly restricts our ability to make them integrate nicely.

By using this extension the browser ChartFox is used in, we are able to adjust the response headers when ChartFox requests chart resources so that they are compatible with CORS, and the application can load them in our full integrated viewer.

This also means that clients still load the charts directly from the supplier - pretty neat, right!

## How it works
This extension will set `Access-Control-Allow-Origin` on the response from chart suppliers to allow ChartFox to access the resource. It will only do this on requests that originate from the ChartFox application.

## License
This source code has been made open-source in the effort for transparency (web extensions shouldn't be clouded in secrecy!). However, this code is still copyrighted and property of Cobalt Grid. Any contributions made to this repository are under the condition that the author assigns the copyright for their contribution to Cobalt Grid.
