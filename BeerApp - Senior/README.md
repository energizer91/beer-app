# Interview requirements

This repository contains the base code for recruitment exercise. Complete the tasks listed below and publish the solution on your github. Send us a link to your repository at least 1 day before the interview.
We will discuss the proposed solution during the interview. You should be ready to present the working application on your local machine.

## Recruitment Task

- [x] Beer page ~ style a cool beer page
- [x] Home page favourites ~ add a list of favourite beers, do not clean after page reload
- [x] Beer list
    - [x] filtering
    - [x] pagination
    - [x] sorting
- [x] Progressive Web App, offline

Thing's I've done extra:
- minor code refactor: used more @mui components instead CSS modules
- redesign beer list
- redesign random beer list
- loading skeletons
- caching fetch requests
- reusing default CRA service worker

Things I've missed during this assignment a:
- Beer list filtering by type: now it's string, didn't have time to do it with select
- favourites written in local storage, since there was no API for that (but I prepared it to use fetch requests in the future)