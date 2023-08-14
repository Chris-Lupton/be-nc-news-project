## To run this project locally

First create the databases:
```
npm run setup-dbs
```

Then you will need to create the .env files:

```
echo PGDATABASE=nc_news >> .env.development

echo PGDATABASE=nc_news_test >> .env.test
```

