# MyGNV

A React + NestJS Webapp to help Gainesville residents find resources easier.

https://mygnv-2.herokuapp.com/

## Mockup

You can see an example of how myGNV Resource Finder should work at https://684v0o.axshare.com/#id=1wgvc4&p=homepage_-_hero_img_-_white__no_img&g=1

## Api Documentation

> Api documentation can be found at https://mygnv-2.herokuapp.com/docs

> Server architecture documentation can be found at https://mygnv-2.herokuapp.com/nestjs-docs

## Getting Started Locally

0. Install [Node.js](https://nodejs.org)
1. `git clone -b database-v2 https://github.com/cityofgainesville/mygnv-resource-finder`
2. `cd mygnv-resource-finder`
3. Configure the .env file with the DB_URI, PORT, JWT_SECRET, JWT_EXPIRATION, REFRESH_TOKEN_EXPIRATION, BCRYPT_ROUNDS, rename from `.env.sample` to `.env`
4. `npm install`
5. `npm run dev`
6. Navigate to `localhost:8080` in a browser

## Populate DB with Information

A script to populate a fresh database with information is located at /server/util/PopulateDB.ts

For this script to run successfully, the .env file must have the MYGNV_EMAIL and MYGNV_PASSWORD fields populated with the email and password of an admin user.

## Editing Maps & Cookies

For the maps, edit Search.js in client > components > home. The components should have 'map' in the class name, and the innerHTML will say "MAP". There is a separate component for mobile and desktop.

For cookies, edit Title.js in client > components > home. The components should have 'cookies' in the class name.    

## Auto Deploy Info

Pushing to database-v2 will auto build and deploy to https://mygnv-2.herokuapp.com/

Only push known good code to master.

## Manually Deploying to Heroku

> This shouldn't be needed due to the auto deploy set up discussed above.

Instructions to deploy on Heroku are as follows:

1. Download and install the Heroku CLI
2. Login to Heroku with `heroku login`
3. `heroku git:remote -a <app_name> `, replacing <app_name> with heroku application name
4. Set up environment variables
    1. `heroku config:set DB_URI=’<db_uri>’`, replacing <db_uri> with the DB uri
    2. `heroku config:set PORT=’<port>’`, replacing <port> with the port number
    3. `heroku config:set JWT_SECRET=’<jwt_secret>’`, replacing <jwt_secret> with the JWT secret
    4. `heroku config:set JWT_EXPIRATION=’<jwt_expiration>’`, replacing <jwt_expiration> with the JWT expiration duration
    5. `heroku config:set REFRESH_TOKEN_EXPIRATION=’<refresh_token_expiration>’`, replacing <refresh_token_expiration> with the Refresh token expiration duration
    6. `heroku config:set BCRYPT_ROUNDS=’<bcrypt_rounds>’`, replacing <bcrypt_rounds> with the number of rounds that bcrypt should perform
7. `git push heroku master`
    1. `heroku logs --tail` to see the logs

## Linting your Code

Before making a pull request, please lint and fix your code.
ESlint will run prettier as well to check for code formatting.

1. `npm run lint`

The linter can automatically fix some (not all) issues with the below command.
This command will also auto format all project files.

2. `npm run lint:fix`

## Building for Deployment

1. `npm run build`
2. `npm start`
3. Built files are being served on `localhost:8080`, or at another port, depending on env config.

## Create, Checkout & Check-in Branches

When starting a new feature, work in a feature branch.

1. `git pull`
2. `git checkout -b featureName`

Now you can add commits and check in the branch.

3. `git add whatever_needs_to_be_added`
4. `git commit -m "commit message"`
5. `git push origin featureName`

## Bring your feature branch up to date with master

1. `git checkout master`
2. `git fetch -p origin`
3. `git merge origin/master`
4. `git checkout featureName`
5. `git merge master`

If there are merge conflicts a text editor may open. VScode is great for this since it shows the diffs and changes clearly. Edit the merge commit to fix issues and commit your updated branch with `git push origin featureName`.

## Make Pull, Push & Merge Requests

When you want to integrate your feature into master, make a pull request on github from your branch.

To prevent merge conflicts, talk with team members before making large changes. Bring your feature branch up with master often to prevent merge conflicts when trying to merge pull requests.

## Technology Stack Used

More dependency information can be found in package.json.

- [MongoDB](https://www.mongodb.com/cloud/atlas)
- [Express](https://expressjs.com/)
- [NestJS](https://nestjs.com/)
- [React](https://reactjs.org/)
- [Sass](https://sass-lang.com)
- [Node.js](https://nodejs.org)
- [Bootstrap](https://getbootstrap.com/)
    - [React Bootstrap](https://react-bootstrap.github.io/)

- Form dependencies
    - [React Select](https://github.com/JedWatson/react-select)
    - [react-jsonschema-form-bs4](https://github.com/peterkelly/react-jsonschema-form-bs4)