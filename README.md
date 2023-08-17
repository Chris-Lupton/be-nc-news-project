# NC News Project

This project runs the back end api for NC News, handling articles, topics, comments and users in a PSQL database.

View this [file](./package.json) to see the available endpoints and how you can interact with them.

[Interact with this api here](https://chrisl-nc-news-project.onrender.com)
***
### To run this project locally

Clone [this](https://github.com/Chris-Lupton/be-nc-news-project) repository and install all dependencies:
```
git clone https://github.com/Chris-Lupton/be-nc-news-project.git

npm install
```

+ First create local databases:
```
npm run setup-dbs
```

+ Then you will need to create these .env files:

```
echo PGDATABASE=nc_news >> .env.development

echo PGDATABASE=nc_news_test >> .env.test
```

+ You can then seed the database with data and run the tests:
```
npm run seed

npm test app
```

Minimum version requirements: 
PSQL | Node
---|---
**`v14.8`** | **`v20.2.0`**
