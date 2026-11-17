# akryst · frontend

my little corner of the internet. a game-style menu, avatars, music... and way too much time spent tweaking animations.

i'm planning a new layout eventually, so i'm leaving this version here for anyone who wants to see how it's built, learn something, or start their own.

## run it

you'll need node.js 22 or newer.

```sh
npm ci
npm run dev
```

then open the address in your terminal.

`npm run build` exports the static site to `out/`. you can put that folder on a static host. `npm run typecheck` checks the types.

## where to poke around

the menu, panels and transitions live in `components/`. pages are in `app/`, including home, portfolio, blog, hos, payments and the 404.

start with `data/demo.ts` to change the content. that's where i left the example profile, projects, tracks, posts and archive entries. styles live in `app/globals.css` and each page's stylesheet.

the guestbook and comments keep their changes in the tab's memory. write something, try the layout, refresh to reset the demo.

## what's here

this is the frontend with example data. the backend, apis, authentication, sqlite and live integrations stay in the private project.

i replaced the video and vrm backgrounds with css backgrounds. the images are placeholders, the fonts come from your system, and the original audio stays with the private site. drop your own assets in `public/` when you have permission to share them.

icons use iconify and can load their graphics from its service. social and project links still point to their public pages. the payments page keeps my public support links too.

## making it yours

edit the content, swap the assets, mess with the layout. that's what this copy is here for.

a license hasn't been added to this repo yet.

made by [akryst](https://github.com/Akryst). if this helps you build your own little corner of the internet, that's pretty cool tbh.
