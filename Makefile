generated/css-purged/tailwind.css: generated/css-full/tailwind.css purgecss.config.js index.html package.json
	mkdir -p generated/css-purged
	yarn css:purge

generated/css-full/tailwind.css: package.json tailwind.src.css
	yarn css:build
