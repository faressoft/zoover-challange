# Zoover Coding Challenge

## Test in Postman

* DocsURL: [https://documenter.getpostman.com/view/104940/zoover/RW1UNiYx](https://documenter.getpostman.com/view/104940/zoover/RW1UNiYx)
* CollectionURL: [https://www.getpostman.com/collections/91141ec299f5b5979637](https://www.getpostman.com/collections/91141ec299f5b5979637)

Open Postman. Click on import (CMD+O). Choose "Import From Link". Enter the collection url. Have fun !

## Configurations 🎉

* The app is configurable in `app/config/config.json`.
* PM2 configurations are in `process.config.js`.

## Data Model

* The data is loaded and cached in memory.
* The accommodations are indexed by their ids for quick access.
* The reviews are indexed by their traveledWith attribute for quick filteration.
* An index is built to speedup the calculation of the averages by keeping a record that consists of reviewsCount, reviewsSummation for each rating aspect indexed by years.

## Cool Things 😀

* DI module.
* Router module.
* API versioning.
* Core modules loading desing pattern `load()`.
* The `require()` is only allowed in `app.js` check the comment in `app.js`.
* Params Schema (Check `app/config/config.json`).
* More types of middlewares (before, service, controller, after, fail).
* Fully documented code, have fun reading it 😀.
* A middleware to separate the validation from the services' code.
* Run a cluster of the app via PM2, configured in `app/config/config.json`.

## Bad Things 😓

* I used the minimal parts of a framework that I built from around 3 years. Some parts of the code need a revamp since they have bad implementation, consistency, naming, documentation like `router.js`, `response.js`, `tasks.js`, `helpers/validate.js`, etc.

# Getting Started

## Setting up the project

In the project directory run

```
npm install
```

## Starting the application

This project runs via PM2 as cluster, you can configure
the number of instances in `app/config/config.json` file

```
npm start
```

# About Me

Mohammad Fares, Senior Software Engineer at Amazon.

* CV: [https://goo.gl/fu1Zcf](https://goo.gl/fu1Zcf)
* LinkedIn: [https://linkedin.com/in/faressoft](https://linkedin.com/in/faressoft)
* GitHub: [https://github.com/faressoft](https://github.com/faressoft)
* GitHubGist: [https://gist.github.com/faressoft](https://gist.github.com/faressoft)

My Best Articles:

* [Scalability Overview, Terms, and Methodologies](https://goo.gl/oxS3MG)
* [Locks, Mutex, Semaphore, Deadlock, Starvation](https://goo.gl/FT8A3P)
* [DOM Performance (Reflow & Repaint)](https://goo.gl/cfjAQr)

My Best Project

* [Mohmal.com](https://www.mohmal.com/en)
