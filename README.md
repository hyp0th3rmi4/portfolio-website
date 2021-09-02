# Portfolio Website

This website has been built by using the theme [prologue](https://pixelarity.com/prologue) by [Pixelarity](https://pixelarity.com). 
The original version of the code has been modified to include all the goodies that we would like to have in web application:

- image minification
- js minification and bundling
- css styling
- packaging via webpack

The configuration of the `package.json` file has been inspired by these two tutorials:

- [https://wweb.dev/blog/how-to-create-static-website-npm-scripts/] : original scaffold, babel, eslint configuration
- [https://medium.com/@jonas_duri/build-a-landing-page-with-webpack-4-6efe83deb7fe] : SASS/CSS processing, templating with handlebars, devserver

Javascript linting has been limited to the `index.js` file only because all the other Javascript files are already minified and are not compliant 
with es6.

In order to make the previous javascript files work with webpack I also had to modify its configuration to ensure that the scripts that expose global 
functions are properly imported and referenced among files. This is necessary for the inclusion of:

- `jquery.min.js` used by the other files.
- `breakpoints.min.js` used by the `main.js` file.

Additional fixes to the CSS have been added to include accreditation to the images taken from [Unsplash](https://unsplash.com).

Image minification has been implemented via [imagemin-webpack-plugin](https://github.com/Klathmon/imagemin-webpack-plugin) and [copy-webpack-plugin](https://github.com/webpack-contrib/copy-webpack-plugin) since the minification via the suggested method by Jonas Duri, was only working for images directly referenced in assets processed through the loaders and did not pick the images that were statically referenced in templates in handlebars.
