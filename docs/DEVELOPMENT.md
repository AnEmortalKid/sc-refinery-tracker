# Development tips


## 


## Setup steps

0. Fork this repository
1. Clone repository
``` 
git clone https://github.com/{GITHUB_USERNAME}/sc-refinery-tracker.git
```
2. Install dependencies 
``` 
cd sc-refinery-tracker
```
```
yarn install
```
3. Run dev server
```
yarn start:watch
```
4. Navigate to localhost:9000 and start making your changes
4. Open PR on main repo requesting merge of changes on your fork


## If you're using just webpack serve

I can't recall if this was always the case, but I seem to have to go to:
```
http://localhost:8080/dist/
```

Instead. Probably something to do with how webpack dev server bundles things.

My flow seems to have to be (for whatever reason, its been 2 years):

```
npx yarn build
npx yarn webpack serve
```

## Deploy to the live site

1. build with webpack
```
npx yarn build
```
2. Copy the contents to the folder
3. Commit to the main branch in the other repo