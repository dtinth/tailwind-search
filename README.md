# @dtinth’s Tailwind CSS Class Search

Having trouble memorizing all 12526 utility classes in Tailwind? Remembered the CSS code, but did not remember which is the corresponding Tailwind CSS utility class? [Search for it here!](https://tailwind.spacet.me/)

This little web application parses Tailwind CSS file right from `unpkg.com`, and generates a searchable index that lets you search for a utility class’s name, if you know the generated CSS code you want.

[![Screenshot](https://github.com/dtinth/timelapse/raw/master/projects/tailwind-search_results.png)](https://tailwind.spacet.me/)

I made this application because I am often confused by Tailwind CSS’ naming of classes.

- When do I use `font-`? e.g. `font-bold`
- When do I use `text-`? e.g. `text-lg` even though it’s `font-size`
- When do I use _neither?_ e.g. `italic`
- Most of the time I know what kind of CSS code I want, but couldn't correctly recall the class name.
- This app also lets you check whether a class is available in Tailwind’s default build. (When I prototype apps, I like to use the Tailwind CSS default builds straight from the CDN.)

## Development

- **No build system needed.** Just clone the Git repository, open `index.html` file in your browser. Edit, save and refresh.
