build:  boxes.js overlay.js dispatcher.js
	browserify -t babelify aspects.js dispatcher.js -o bundle.js
ios:  boxes.js overlay.js dispatcher.js cart.js
	browserify -t [ babelify --presets [ react ] ] aspects.js dispatcher.js -o bundle.js
