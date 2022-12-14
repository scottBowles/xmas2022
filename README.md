# Christmas Competition 2022

## Getting Started

Hopefully this all works, but it's very possibly missing something. Let me know if you have any issues and I'll help troubleshoot.

1. Clone the repo and run `npm i` to install dependencies
1. Create a .env file in the root of the project and that will hold the following:

   ```
   JWT_ACCESS_SECRET=<anything you want>
   DATABASE_URL=<url for an empty postgres database>
   SHADOW_DATABASE_URL=<might not need this, but if you do, a second empty postgres database url>
   PUBLIC_GOOGLE_CLIENT_ID=<ask me for this>
   GOOGLE_CLIENT_SECRET=<ask me for this>
   ```

   For DATABASE_URL, you'll have to create an empty postgres database.
   If your default template uses extensions, it may give you issues (it gave me issues), in which case create your database using template0. If that's the case, you'll probably also need to manually create the shadow database prisma uses to detect issues with any schema changes. If you know how to do this without issue go for it and ignore the following. Here's how I did it, possibly badly, using psql from the command line.

   1. `psql`
   1. `CREATE DATABASE xmas2022 TEMPLATE template0;`
   1. `CREATE DATABASE xmas2022shadow TEMPLATE template0;`
   1. `\q`
   1. You'll need a user and password for the database. I used the same ones I'm using for my other local databases, which seems to be working.
   1. The url strings take the form `postgres://<user>:<password>@localhost:5432/<database name>`

1. To sync the database with the schema, run `npx prisma migrate dev`. If it works, you shouldn't get any errors, and your database should match the schema in `prisma/schema.prisma`.
1. You'll need to generate the prisma client with `npx prisma generate`. It creates files in `node_modules/.prisma` that are used by the app. Kinda weird if you ask me, but that's how it works.
1. You should be able to explore your database with `npx prisma studio`, similar to the Django admin (but tbh not nearly as nice).
1. Run `npm run dev -- --open` to start the dev server and open the app in your browser. There's a small chance you'll have to run `svelte-kit sync` to tell SvelteKit to create its files, but it should take care of this for you.

## Docs

- [SvelteKit](https://kit.svelte.dev/)
- [Svelte](https://svelte.dev/)
- [Prisma](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)

## Notes

The current app doesn't have a lot, but that should make it a good starting point for trying to get a sense for how things are working together. Currently, it just allows signup and login, which gives access to the guarded page.

### Troubleshooting

Sometimes I find I need to manually restart the dev server to get SvelteKit to regenerate types, especially with new code. If you're getting a bunch of errors or red squigglies, try that or `svelte-kit sync`.

Don't wait long before asking for help. These instructions are untested, and in general if you're spinning your wheels on something with this stack there's a good chance I have too.

### Types

The vast majority of the types needed are generated by Prisma and SvelteKit, so you mostly get to enjoy great type hints. The SvelteKit types will typically come from './$types' if autogenerated or '@sveltejs/kit' if not. Prisma's types come from the schema and generally just work.

### Prisma

As we develop the schema, we'll modify `schema.prisma` then run `npx prisma migrate dev` to create a new migration file and update the database. If you pull down changes from the repo with migrations, you'll run `npx prisma migrate dev` to update your database.

### Svelte

To get a quick feel for Svelte, you can go to https://component-party.dev/ and see some common components alongside Vue equivalents. Beyond that, the Svelte docs are good.

### SvelteKit

The SvelteKit docs are decent but also a work in progress and error messages aren't always great. Let me know if you run into anything. Here's a quick introduction to what you'll see:

The `hooks.server.ts` file exports a `handle` function that gets called on every request. Currently it's used to check for an auth cookie and populate `locals.user` if a user is logged in (has a valid auth cookie).

The site's urls are generated based on the folders within the routes folders (and can be nested from there).

For there to be a page, there will be a `+page.svelte` file in the folder.

If there's a `+page.ts` file, it will run on both the server and the client and can export a `load` function that will get passed to `+page.svelte` as a prop named `data`.

If there's a `+page.server.ts` file, it will only run on the server and can export a `load` function that will also get passed to `+page.svelte` as a prop named `data`. If you have both `+page.ts` and `+page.server.ts`, you might need to pass the data from one to the other. Currently, you can see these `+page.server.ts` `load` functions checking whether `locals.user` exists and possibly redirecting accordingly.

A `+page.server.ts` file can also export an `actions` object that can respond to requests. For instance, if you have a `default` function in the `actions` object, it will get called when a form is submitted in the `+page.svelte` at that route. You can also name action functions, which will correspond to a form's `action` attribute, and you can hit those endpoints across routes and so on. Currently, you can see this functionality in use for the login and signup forms.

A `+server.ts` file is like an api endpoint that can export functions corresponding to HTTP verbs like GET, POST, PATCH, PUT and DELETE. The `logout/` and `(unauthenticated)/googleCallback/` folders use these.

`+layout.svelte` files apply a layout to everything downstream from them in the file system. `+layout.server.ts` and the like do the same for the layout as `+page.server.ts` does for a page. Layouts can also have groups of pages that they apply to, which is how the `(authenticated)` and `(unauthenticated)` layouts work. With the parentheses, they are applied as layout groups but don't affect the urls of the pages they wrap.

Everything in the `lib` file can be imported as `$lib/<file name>`.
