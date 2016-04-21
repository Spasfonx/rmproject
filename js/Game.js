"use strict";

function Game() {

	this.run = function(gameContainer, debugContainer, gameField) {

		var mapGenerator = new MapGenerator();
		var map = mapGenerator.generateRandomMap(17, 0, 2, 1);
		var soucoupe1 = new Soucoupe();
		var soucoupe2 = new Soucoupe();
		var commande = new Commande();
		var ctx;
		var canvas;
		Soucoupe.loadSoucoupe();
		Tourelle.loadTourelle();
		Bullet.loadBullet();

		Sprite.loadSprite();

		window.onload = function() {
			var container = document.getElementById(gameContainer);
			var gamefield = document.getElementById(gameField);
			var debug = debugContainer !== null ? document
					.getElementById(debugContainer) : null;

			var n = Math.log(document.body.scrollWidth / 32 - 1) / Math.log(2);
			n = Math.ceil(n);

			var mapSize = Math.pow(2, n) + 1;

			debug.innerHTML = mapSize + "-" + map.minValueMap + "-"
					+ map.maxValueMap;

			map.drawMap(container);
			canvas = document.createElement("canvas");
			canvas.width = map.mapGraphics.length * Constantes.TILE_SIZE;
			canvas.height = map.mapGraphics[1].length * Constantes.TILE_SIZE;

			ctx = canvas.getContext('2d');
			soucoupe1.posX = map.player1StartPlaceX*Constantes.TILE_SIZE;
			soucoupe1.posY = map.player1StartPlaceY*Constantes.TILE_SIZE;
			soucoupe2.posX = map.player2StartPlaceX*Constantes.TILE_SIZE;
			soucoupe2.posY = map.player2StartPlaceY*Constantes.TILE_SIZE;
			gamefield.innerHTML = "";
			gamefield.appendChild(canvas);
			var m="   0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 \n";
			for (var i = 0; i <17; i++) {
				if(i<10)
				m+=i+"  ";
				else
				m+=i+" ";
				for (var j = 0; j < 17; j++){
					
					m+= map.mapField[i][j] + "  ";
				}
				m+="\n";
			}
			console.log(m);
		
		draw();
		}
		function draw() {
			setTimeout(function() {
				requestAnimationFrame(draw);
				ctx.clearRect(0, 0,canvas.width, canvas.height);
				if (commande.downPress) {
					if(map.isTraversable(((soucoupe1.posX)/Constantes.TILE_SIZE),((soucoupe1.posY+32)/Constantes.TILE_SIZE)))
					soucoupe1.bas();
				
				}
				if (commande.upPress) {
					if(map.isTraversable(((soucoupe1.posX)/Constantes.TILE_SIZE),((soucoupe1.posY-32)/Constantes.TILE_SIZE)))
					soucoupe1.haut();
				}
				if (commande.leftPress) {
					if(map.isTraversable((((soucoupe1.posX-32)/Constantes.TILE_SIZE)),((soucoupe1.posY)/Constantes.TILE_SIZE)))
					soucoupe1.gauche();
				}
				if (commande.rightPress) {
					if(map.isTraversable(((soucoupe1.posX+32)/Constantes.TILE_SIZE),((soucoupe1.posY)/Constantes.TILE_SIZE)))
					soucoupe1.droite();
				}
				if (commande.aPress) {
					soucoupe1.uneTourelle.degre -= 4;
				}
				if (commande.ePress) {
					soucoupe1.uneTourelle.degre += 4;
				}
				if (commande.spacePress) {
					soucoupe1.uneTourelle.tirer();

				}
				soucoupe2.drawSoucoupe(ctx);
				soucoupe1.drawSoucoupe(ctx);
				
			},1000/Constantes.NBFPS);
	};
	 $(window).keydown(function (e) {
         // alert(scp1.vitesse); 
         if (e.keyCode == commande.arrowDown) {

             commande.downPress = true;
         }
         if (e.keyCode == commande.arrowLeft) {
             commande.leftPress = true;
         }
         if (e.keyCode == commande.arrowRight) {
             commande.rightPress = true;
         }
         if (e.keyCode == commande.arrowUp) {
             commande.upPress = true;

         }

         if (e.keyCode == commande.aKey) {
             commande.aPress = true;
         }
         if (e.keyCode == commande.eKey) {
             commande.ePress = true;
         }

         if (e.keyCode == commande.spaceKey) {
             commande.spacePress = true;
             //    alert(scp1.uneTourelle.nbBullet);
         }

     });

     $(window).keyup(function (e) {
         // alert(scp1.vitesse); 
         if (e.keyCode == commande.arrowDown) {

             commande.downPress = false;
         }
         if (e.keyCode == commande.arrowLeft) {
             commande.leftPress = false;
         }
         if (e.keyCode == commande.arrowRight) {
             commande.rightPress = false;
         }
         if (e.keyCode == commande.arrowUp) {
             commande.upPress = false;

         }
         if (e.keyCode == commande.aKey) {
             commande.aPress = false;
         }
         if (e.keyCode == commande.eKey) {
             commande.ePress = false;
         }

         if (e.keyCode == commande.spaceKey) {
             commande.spacePress = false;
         }


     });
	}
}
