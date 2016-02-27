"use strict";

function Game() {

	this.run = function(gameContainer, debugContainer) {

		var mapGenerator = new MapGenerator();
		var map          = mapGenerator.generateRandomMap(65, 0, 2, 1);

		Sprite.loadSprite();

		window.onload = function() {
			var container = document.getElementById(gameContainer);
			var debug     = debugContainer !== null ? document.getElementById(debugContainer) : null;

			var n = Math.log(document.body.scrollWidth / 32 - 1) / Math.log(2);
				n = Math.ceil(n);

			var mapSize = Math.pow(2, n) + 1;

			debug.innerHTML = mapSize + "-" + map.minValueMap + "-" + map.maxValueMap;

			map.drawMap(container);
		};

	};

}