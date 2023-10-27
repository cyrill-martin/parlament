# The Swiss Parliament

This repository houses the files for the Swiss Parliament visualization, which is available and detailed at [parlament.kmapper.com](https://parlament.kmapper.com/). This visualization is a public portfolio project by [kmapper GmbH](https://kmapper.com), and it's built using open data sourced from [parlament.ch](https://www.parlament.ch/).


## Dependencies

- node.js
- Python 3 if you want to pull new data from parlament.ch.

## Serve and Develop Locally

1. Clone repository
2. `cd` into repository
3. Run `npm install` to get the needed npm packages
4. Run `npm run serve` to serve on http://localhost:8080

## Build production files

Run `npm run build` to build files in a `dist` directory.

## Deploy to GitHub Pages

Run `npm run deploy` to build production files and push them to the gh-pages branch on GitHub. 

## License

MIT