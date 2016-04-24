/**
 * Classe Map permettant d'afficher et de gérer le terrain.
 */
function Map() {

	const
	OFFSET_START_PLACE_X = 2;

	/**
	 * Matrice carrée contenant les valeurs de base après la génération
	 * (heightmap).
	 * 
	 * @type {[int]}
	 */
	this.mapRaw = null;

	/**
	 * Matrice carrée contenant le type de terrain de chaque case.
	 * 
	 * @type {[FieldSet]}
	 */
	this.mapField = null;

	/**
	 * Matrice carrée contenant la référence aux tiles graphiques de chaque
	 * case.
	 * 
	 * @type {[TileSet]}
	 */
	this.mapGraphics = null;

	/**
	 * Coordonées de départ X du joueur 1.
	 * 
	 * @type {int}
	 */
	this.player1StartPlaceX = null;

	/**
	 * Coordonées de départ Y du joueur 1.
	 * 
	 * @type {int}
	 */
	this.player1StartPlaceY = null;

	/**
	 * Coordonées de départ X du joueur 2.
	 * 
	 * @type {int}
	 */
	this.player2StartPlaceX = null;

	/**
	 * Coordonées de départ Y du joueur 2.
	 * 
	 * @type {int}
	 */
	this.player2StartPlaceY = null;

	/**
	 * Déssine la carte dans un canvas, puis l'intègre dans le container passé
	 * en paramètre.
	 * 
	 * @param {[string]}
	 *            container - ID de l'élément HTML qui va contenir la carte.
	 * @return {[void]}
	 */
	this.drawMap = function(container) {
		this.generateFieldMap();
		this.generateGraphicsMap();

		var map = this.mapGraphics;

		var dimX = map.length * Constantes.TILE_SIZE;
		var dimY = map[1].length * Constantes.TILE_SIZE;

		var canvas = document.createElement("canvas");
		canvas.width = dimX;
		canvas.height = dimY;

		var ctx = canvas.getContext('2d');

		var posX = 0;
		var posY = 0;

		for (var i = 0; i < map.length; i++) {
			for (var j = 0; j < map[i].length; j++) {
				var currentGraphic = map[i][j];
				var tile = TileSet[currentGraphic];

				ctx.beginPath();
				tile.drawSprite(ctx, posX, posY);

				if (Constantes.DEBUG) {
					// Affichage de la grille
					ctx.rect(posX, posY, Constantes.TILE_SIZE,
							Constantes.TILE_SIZE);
					ctx.stroke();

					ctx.font = "10px Arial";
					ctx.fillText(i + ", " + j, posX + Constantes.TILE_SIZE / 2,
							posY + Constantes.TILE_SIZE / 2);
				}

				ctx.closePath();

				posX += Constantes.TILE_SIZE;
			}

			posX = 0;
			posY += Constantes.TILE_SIZE;
		}

		if (Constantes.DEBUG) {
			// Dessin de la position de départ des deux joueurs
			ctx.beginPath();

			ctx.rect(this.player1StartPlaceY * Constantes.TILE_SIZE,
					this.player1StartPlaceX * Constantes.TILE_SIZE,
					Constantes.TILE_SIZE, Constantes.TILE_SIZE);

			ctx.rect(this.player2StartPlaceY * Constantes.TILE_SIZE,
					this.player2StartPlaceX * Constantes.TILE_SIZE,
					Constantes.TILE_SIZE, Constantes.TILE_SIZE);

			ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
			ctx.fill();

			ctx.closePath();
		}

		container.innerHTML = "";
		container.appendChild(canvas);
	}

	/**
	 * Genere la map contenant le type de terrain pour chaque case.
	 * 
	 * @return {void}
	 */
	this.generateFieldMap = function() {
		var map = this.mapRaw;

		// On transforme les nombres présents dans mapRaw
		// afin d'obtenir un tableau de terrain (FieldSet).
		if (map != null) {
			this.mapField = new Array(map.length);

			for (var i = 0; i < map.length; i++) {
				this.mapField[i] = new Array(map[i].length);

				for (var j = 0; j < map[i].length; j++) {
					var currentPoint = map[i][j];
					var field;

					if (currentPoint >= 120 || this.isOnEdge(i, j)) {
						field = FieldSet.GRASS;
					} else if (currentPoint >= 0) {
						field = FieldSet.WATER;
					}

					this.mapField[i][j] = field;

				}
			}
		}

		// On initialise les points de départ des deux joueurs
		this.initializePlayersPlaces();

		// On regarde si un chemin existe entre le joueur 1 et le joueur 2
		var graphMap = new Graph(this.mapField, {
			diagonal : false
		});
		var start = graphMap.grid[this.player1StartPlaceX][this.player1StartPlaceY];
		var end = graphMap.grid[this.player2StartPlaceX][this.player2StartPlaceY];
		var path = astar.search(graphMap, start, end, {
			closest : false
		});

		// Si aucun chemin n'existe entre les deux joueurs, on le crée
		if (path.length == 0) {
			var y = this.player1StartPlaceY;

			for (var x = 0; x < this.mapField.length; x++) {
				if (this.mapField[x][y] == FieldSet.WATER) {
					this.mapField[x][y] = FieldSet.GRASS;
				}
			}
		}

	}

	/**
	 * Genere la map contenant les sprites finaux à afficher.
	 * 
	 * @return {void}
	 */
	this.generateGraphicsMap = function() {
		var map = this.mapField;

		// Transforme les cases de terrain en sprite final. On cherche
		// a ce que les sprites soient fondus entre eux, donc on recupère
		// la bonne sprite en fonction de ce qui l'entoure.
		if (map != null) {
			this.mapGraphics = new Array(map.length);

			for (var i = 0; i < map.length; i++) {
				this.mapGraphics[i] = new Array(map[i].length);

				for (var j = 0; j < map[i].length; j++) {
					var currentField = map[i][j];
					var nameCurrentField = FieldSet.properties[currentField].name;
					var positionTile = "MM";

					// Si on est sur les bords, on ne met que de l'herbe
					if (!this.isOnEdge(i, j)) {
						positionTile = this.getPositionTileFromField(i, j);
					}

					this.mapGraphics[i][j] = nameCurrentField + "_"
							+ positionTile;
				}
			}

		}
	}

	/**
	 * Récupère la disposition graphique de la case.
	 * 
	 * @param {int}
	 *            currentX - Position X courante dans la matrice
	 * @param {int}
	 *            currentY - Position Y courante dans la matrice
	 * @return {string} Position de la tile (voir TileSet).
	 */
	this.getPositionTileFromField = function(currentX, currentY) {
		/**
		 * Matrice sur laquelle on opère : [TL][TM][TR] [ML][MM][MR]
		 * [BL][BM][BR]
		 * 
		 * TL : Top Left MM : Midle Midle BR : Bottom Right etc...
		 * 
		 * Configurations : La configuration dans laquelle on se trouve - X :
		 * Terrain différent du terrain courant - C : Position i, j courante - O :
		 * Même terrain que la position i, j
		 */

		var map = this.mapField;

		var topLeft = map[currentX - 1][currentY - 1];
		var topMidle = map[currentX - 1][currentY];
		var topRight = map[currentX - 1][currentY + 1];

		var midleLeft = map[currentX][currentY - 1];
		var midleRight = map[currentX][currentY + 1];

		var bottomLeft = map[currentX + 1][currentY - 1];
		var bottomMidle = map[currentX + 1][currentY];
		var bottomRight = map[currentX + 1][currentY + 1];

		var currentPoint = map[currentX][currentY];

		var positionTile;

		/** ********* DOUBLE CORNER ******** */

		/*
		 * Configuration : Double Corner Top [X][X][X] [X][C][X]
		 */
		if (currentPoint < topLeft && currentPoint < topMidle
				&& currentPoint < topRight && currentPoint < midleLeft
				&& currentPoint < midleRight) {
			positionTile = "DOUBLE_C_T";
		}

		/*
		 * Configuration : Double Corner Bottom [X][C][X] [X][X][X]
		 */
		else if (currentPoint < bottomLeft && currentPoint < bottomMidle
				&& currentPoint < bottomRight && currentPoint < midleLeft
				&& currentPoint < midleRight) {
			positionTile = "DOUBLE_C_B";
		}

		/*
		 * Configuration : Double Corner Left [X][X] [X][C] [X][X]
		 */
		else if (currentPoint < topLeft && currentPoint < topMidle
				&& currentPoint < midleLeft && currentPoint < bottomLeft
				&& currentPoint < bottomMidle) {
			positionTile = "DOUBLE_C_L";
		}

		/*
		 * Configuration : Double Corner Left [X][X] [C][X] [X][X]
		 */
		else if (currentPoint < topRight && currentPoint < topMidle
				&& currentPoint < midleRight && currentPoint < bottomRight
				&& currentPoint < bottomMidle) {
			positionTile = "DOUBLE_C_R";
		}

		/** ********* TOP ********* */

		/*
		 * Configuration : Top Left [X][X] [X][C]
		 */
		else if (currentPoint < topLeft && currentPoint < topMidle
				&& currentPoint < midleLeft) {
			positionTile = "TL";
		}

		/*
		 * Configuration : Top Right [X][X] [C][X]
		 */
		else if (currentPoint < topRight && currentPoint < topMidle
				&& currentPoint < midleRight) {
			positionTile = "TR";
		}

		/*
		 * Configuration : Top Midle [X][X] ou [X][X] [C] [C]
		 */
		else if ((currentPoint < topLeft && currentPoint < topMidle)
				|| (currentPoint < topMidle && currentPoint < topRight)) {
			positionTile = "TM";
		}

		/** ********* BOTTOM ********* */

		/*
		 * Configuration : Bottom Left [X][C] [X][X]
		 */
		else if (currentPoint < midleLeft && currentPoint < bottomLeft
				&& currentPoint < bottomMidle) {
			positionTile = "BL";
		}

		/*
		 * Configuration : Bottom Right [C][X] [X][X]
		 */
		else if (currentPoint < midleRight && currentPoint < bottomRight
				&& currentPoint < bottomMidle) {
			positionTile = "BR";
		}

		/*
		 * Configuration : Bottom Midle [C] [C] [X][X] ou [X][X]
		 */
		else if ((currentPoint < bottomLeft && currentPoint < bottomMidle)
				|| (currentPoint < bottomMidle && currentPoint < bottomRight)) {
			positionTile = "BM";
		}

		/** ********* MIDDLE ********* */

		/*
		 * Configuration : Midle Left [X][C] ou [X] [X] [X][C]
		 */
		else if ((currentPoint < topLeft && currentPoint < midleLeft)
				|| (currentPoint < midleLeft && currentPoint < bottomLeft)) {
			positionTile = "ML";
		}

		/*
		 * Configuration : Right [X] ou [C][X] [C][X] [X]
		 */
		else if ((currentPoint < topRight && currentPoint < midleRight)
				|| (currentPoint < midleRight && currentPoint < bottomRight)) {
			positionTile = "MR";
		}

		/** ******** CORNERS ******** */

		/*
		 * Configuration : Corner Top Right [O][X] [C][O]
		 */
		else if (topMidle < topRight && currentPoint < topRight
				&& midleRight < topRight) {
			positionTile = "C_TR";
		}

		/*
		 * Configuration : Corner Top Left [X][O] [O][C]
		 */
		else if (topMidle < topLeft && currentPoint < topLeft
				&& midleRight < topLeft) {
			positionTile = "C_TL";
		}

		/*
		 * Configuration : Corner Bottom Right [C][O] [O][X]
		 */
		else if (midleRight < bottomRight && currentPoint < bottomRight
				&& bottomMidle < bottomRight) {
			positionTile = "C_BR";
		}

		/*
		 * Configuration : Corner Bottom Left [O][C] [X][O]
		 */
		else if (midleLeft < bottomLeft && currentPoint < bottomLeft
				&& bottomMidle < bottomLeft) {
			positionTile = "C_BL";
		}

		/** ******** CAS PARTICULIERS ********* */
		/*
		 * Configuration : Midle Right [C][X]
		 */
		else if (currentPoint < midleRight) {
			positionTile = "MR";
		}

		/*
		 * Configuration : Midle Left [X][C]
		 */
		else if (currentPoint < midleLeft) {
			positionTile = "ML";
		}

		/*
		 * Configuration : Bottom Middle [C] [X]
		 */
		else if (currentPoint < bottomMidle) {
			positionTile = "BM";
		}

		else {
			positionTile = "MM";
		}

		return positionTile;
	}

	/**
	 * Vérifie si les coordonnées données sont sur les bords de la carte.
	 * 
	 * @param {int}
	 *            x - Coordonées x
	 * @param {int}
	 *            y - Coordonée y
	 * @return {Boolean} Vrai si les coordonnées [x, y] sont sur les bords de la
	 *         carte.
	 */
	this.isOnEdge = function(x, y) {
		return x == 0 || x == this.mapRaw.length - 1 || y == 0
				|| y == this.mapRaw.length - 1;

	}

	this.isTraversable = function(x, y) {
		var roundX = Math.round(x);
		var roundY = Math.round(y);
		
		for (var i = 0; i < this.mapField.lenght; i++) {
			for (var j = 0; j < this.mapField[j].lenght; j++){
				console.log(this.mapField[i][j] + " ");
			}
		}
		console.log("round x "+roundX +" round y"+ roundY+ "type"+this.mapField[roundX][roundY] );
		console.log( this.mapField[roundY][roundX] == 2);
		return  this.mapField[roundY][roundX] == 2;
	}

	/**
	 * Initialise la position de départ des joueurs.
	 * 
	 * @return {[void]}
	 */
	this.initializePlayersPlaces = function() {
		this.player1StartPlaceX = OFFSET_START_PLACE_X;
		this.player2StartPlaceX = this.mapRaw.length - 1 - OFFSET_START_PLACE_X;

		this.player1StartPlaceY = Math.round(this.mapRaw.length / 2);
		this.player2StartPlaceY = Math.round(this.mapRaw.length / 2);

		console.log("player1 start place : " + this.player1StartPlaceX + ", "
				+ this.player1StartPlaceY);
		console.log("player2 start place : " + this.player2StartPlaceX + ", "
				+ this.player2StartPlaceY);
	}

}