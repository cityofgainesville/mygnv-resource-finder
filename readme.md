# MyGNV

A React + Express Webapp to help Gainesville residents find resources easier.

https://mygnv.herokuapp.com/

## Getting Started Locally

1. Clone the repo
2. `cd mygnv-team-10d`
3. Configure the .env file with the DB_URI, PORT, and SESSION_SECRET, rename from `.env.sample` to `.env`
4. `npm install`
5. `npm run dev`
6. Navigate to `localhost:8080`

## Auto Deploy Info

Pushing to master will auto build and deploy to https://mygnv.herokuapp.com/

Only push known good code to master.

## Manually Deploying to Heroku

> This shouldn't be needed due to the auto deploy set up discussed above.

Instructions to deploy on Heroku are as follows:

1. Download and install the Heroku CLI
2. Login to Heroku with `heroku login`
3. `heroku git:remote -a <app_name> `, replacing <app_name> with heroku application name
4. Set up environment variables
    1. `heroku config:set SESSION_SECRET=’<session_secret>’`, replacing <session_secret> with the session secret
    2. `heroku config:set DB_URI=’<db_uri>’`, replacing <db_uri> with the DB uri
7. `git push heroku master`
    1. `heroku logs --tail` to see the logs

## Api Documentation

### Categories

```
/api/categories/list
GET will return JSON of all categories

/api/categories/create
POST will create category if user authenticated

/api/categories/listTopLevel
GET will return JSON of all top level categories

/api/categories/:categoryId
GET will return category
/* 
  GET Accepts query parameters in this format
  children=true // or false or undefined
  providers=true // or false or undefined
  True will populate the array, false will leave it as an array of ObjectIDs.
*/

/api/categories/update/:categoryId
POST will update category if authenticated

/api/categories/delete/:categoryId
DELETE will delete category if authenticated
```

### Providers

```
/api/providers/list
GET will return JSON of all providers

//POST will create provider if user authenticated

/api/providers/create
POST will create provider if user authenticated

/api/providers/:providerId
GET will return provider

/api/providers/update/:providerId
POST will update provider if authenticated

/api/providers/delete/:providerId
DELETE will update provider if authenticated
```

### Users
```
/api/users/login
POST with correct email and password field
will login and start session

/api/users/logout
POST will end session if there in an active session

/api/users/isLoggedIn
POST will return status: true in JSON if logged in

/api/users/:userId
GET to read user by id
```

/api/users/register
POST
Will create new user if current user has role === 'Owner'

/api/users/update/:userId
POST
Complete user editing control if current user has role === 'Owner'
If no userId passed in then logged in user is updated

/api/users/delete/:userId
DELETE to delete user by id

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
- [React](https://reactjs.org/)
- [Sass](https://sass-lang.com)
- [Node.js](https://nodejs.org)
- [Bootstrap](https://getbootstrap.com/)
    - [React Bootstrap](https://react-bootstrap.github.io/)

- Form dependencies
    - [React Select](https://github.com/JedWatson/react-select)
    - [react-jsonschema-form-bs4](https://github.com/peterkelly/react-jsonschema-form-bs4)

## Screenshots

Category view: Each user can search for a provider based on a category they choose. These categories can go several layers.
![](./example_img/categories.png)

Provider info: When each provider is selected, it pulls information from the database, supplying the user with a description, location, contacts information and more.
![](./example_img/provider_info.png)

Provider search: Users can search for any provider if they already know what they’re looking for using a dynamic search bar. This links back to the database.
![](./example_img/provider_list.png)

Login: If a user has an admin account, they may login to the admin portal using a secure password and login.
![](./example_img/login.png)