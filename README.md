#Angular Template
Very basic angular template for you to clone and start your project right away

##Requirements
- npm

##Installation
Clone this repo, then run the following commands
```
$ npm install
$ bower install
```

##Gulp Commands
`gulp sass`
Compiles all the sass files located at the sass/ folder and also from all bower components

`gulp build`
Gathers all bower components and source files inside your src/ folder and inject them into your index.html file (mind the inject comments inside the html file) it also compiles the sass sheets

`gulp`
Sets up a livereload service which will do the previous tasks everytime local changes occur

##Style
- Place all js files inside the src/ folder using the same hierarchy the example follows
```
+-- src
  +-- module
    +-- module.js
    +-- directives
    | +-- directive.js
    +-- controllers
    | +-- controller.js
    +-- templates
      +-- template.html
```
- SCSS and sass files and directories ought to be placed within the sass/ folder, modules must be prefixed with an underscore ( \_ )
```
+-- sass
  +-- theme.scss
  +-- module-1
    +-- _module-file-1.scss
    +-- _module-file-2.scss
  +-- module-2
    +-- _module-file-1.scss
```
- Files don't have to be manually included into index.html, this should be done using the `gulp build` task
