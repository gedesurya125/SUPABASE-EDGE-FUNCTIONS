# SUPABASE EDGE FUNCTION

## RESOURCES:

1. Quick start https://supabase.com/docs/guides/functions/quickstart
2. Deploying to the production: https://supabase.com/docs/guides/functions/deploy
3. Installing Docker: https://docs.docker.com/desktop/install/mac-install/
4. Creating CRUD API example https://github.com/supabase/supabase/blob/master/examples/edge-functions/supabase/functions/restful-tasks/index.ts
5. Folder structure recomendation https://supabase.com/docs/guides/functions/quickstart#organizing-your-edge-functions
6. Error Handling https://supabase.com/docs/guides/functions/quickstart#error-handling
7. Managing Dependencies https://supabase.com/docs/guides/functions/import-maps
8. Examples : https://supabase.com/docs/guides/functions
9. Managing Env file https://supabase.com/docs/guides/functions/secrets

# COMAND:

1. `supabase start` to start the supabase stack local services
2. `supabase functions server` to start the Functions watcher
3. `supabase stop --no-backup` to stop the supabase stack local services
4. `supabase functions new hello-world` to create a new function
5. `supabase functions serve --env-file ./supabase/.env` to start the Function watcher with env file loaded
6. `deno test --allow-all --env=supabase/functions/.env` to run the test

## Question and Answer :

1. Why we have to use Deno test intead of Jest to do a testing ?

- Deno Test is built in test in Deno no need to install external package.
- Deno test is faster than jest https://timdeschryver.dev/blog/the-initial-developer-experience-while-trying-out-deno-for-the-first-time#it-and-39-s-easy-and-fast.
- Jest cannot be officially installed in Deno https://jestjs.io/docs/getting-started
- Here is a tweaking about how to add mocha to Deno https://dev.to/craigmorten/testing-your-deno-apps-with-mocha-4f35. But cannot be used with jest because jest doesn't have official browser support
- Here is the not official jest package for Deno with limitation, https://github.com/ValeriaVG/tiny-jest.
- But Deno has official library to do the test which has the same format as JEST https://docs.deno.com/runtime/manual/basics/testing/behavior_driven_development

2. How we can run the test before we deploy the function to the supabase
