/**
 * Classe Map permettant d'afficher et de gérer le terrain.
 */
function Map() {

	/**
	 * Matrice 2x2 contenant les valeurs de base après la génération (heightmap).
	 * @type {[int]}
	 */
	this.mapRaw      = null;

	/**
	 * Matrice 2x2 contenant le type de terrain de chaque case.
	 * @type {[FieldSet]}
	 */
	this.mapField    = null;

	/**
	 * Matrice 2x2 contenant la référence aux tiles graphiques de chaque case.
	 * @type {[TileSet]}
	 */
	this.mapGraphics = null;

	/**
	 * Déssine la carte dans un canvas, puis l'intègre dans le container passé
	 * en paramètre.
	 * @param  {[string]} container - ID de l'élément HTML qui va contenir la carte.
	 * @return {[void]}
	 */
	this.drawMap = function (container) {
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

		for (var i = 1; i < map.length - 2; i++) {
			for (var j = 1; j < map[i].length - 2; j++) {
				var currentGraphic = map[i][j];
				var tile           = TileSet[currentGraphic];

				ctx.beginPath();
				tile.drawSprite(ctx, posX, posY);

				if (Constantes.DEBUG) {
					ctx.rect(posX, posY, Constantes.TILE_SIZE, Constantes.TILE_SIZE);
					ctx.stroke();

					ctx.font = "10px Arial";
					ctx.fillText(
						this.mapField[i][j],
						posX + Constantes.TILE_SIZE / 2, 
						posY + Constantes.TILE_SIZE / 2
					);
				}

				ctx.closePath();

				posX += Constantes.TILE_SIZE;
			}

			posX = 0;
			posY += Constantes.TILE_SIZE;
		}

		// ctx.beginPath();
		// 	ctx.rect(0, 0, document.body.scrollWidth, document.body.scrollHeight);
		// 	ctx.lineWidth = 10;
		// 	ctx.strokeStyle = "#ff0000";
		// 	ctx.stroke();
		// ctx.closePath();

		container.innerHTML = "";
		container.appendChild(canvas);
	}

	/**
	 * Genere la map contenant le type de terrain pour chaque case
	 * @return {void}
	 */
	this.generateFieldMap = function() {
		var map = this.mapRaw;

		if (map != null) {
			this.mapField = new Array(map.length);

			for (var i = 0; i < map.length; i++) {
				this.mapField[i] = new Array(map[i].length);

				for (var j = 0; j < map[i].length; j++) {
					var currentPoint = map[i][j];
					var field;

					if (currentPoint >= 30) {
						field = FieldSet.GRASS;
					} else if (currentPoint >= 0) {
						field = FieldSet.WATER;
					}

					this.mapField[i][j] = field;

				}
			}
		}
		
	}

	/**
	 * Genere la map contenant les sprites finaux à afficher
	 * @return {void}
	 */
	this.generateGraphicsMap = function() {
		var map = this.mapField;

		if (map != null) {
			this.mapGraphics = new Array(map.length);

			for (var i = 1; i < map.length - 2; i++) {
				this.mapGraphics[i] = new Array(map[i].length);

				for (var j = 1; j < map[i].length - 2; j++) {
					var currentField     = map[i][j];
					var positionTile     = this.getPositionTileFromField(i, j);
					var nameCurrentField = FieldSet.properties[currentField].name;

					this.mapGraphics[i][j] = nameCurrentField + "_" + positionTile;
				}
			}

		}
	}

	/**
	 * Récupère la disposition graphique de la case ainsi que le terrain courant
	 * et le terrain concurrent.
	 * @param  {[int]} currentX - Position X courante dans la matrice
	 * @param  {[int]} currentY - Position Y courante dans la matrice
	 * @return {[string]} Position de la tile (voir TileSet).
	 */
	this.getPositionTileFromField = function (currentX, currentY) {
		/**
		 * Matrice sur laquelle on opère :
		 * [TL][TM][TR]
		 * [ML][MM][MR]
		 * [BL][BM][BR]
		 *
		 * TL : Top Left
		 * MM : Midle Midle
		 * BR : Bottom Right
		 * etc...
		 *
		 * Configurations : La configuration dans laquelle on se trouve
		 * - X : Terrain différent du terrain courant
		 * - C : Position i, j courante
		 * - O : Même terrain que la position i, j
		 */
		
		var map          = this.mapField;

		var topLeft  = map[currentX - 1][currentY - 1];
		var topMidle = map[currentX - 1][currentY];
		var topRight = map[currentX - 1][currentY + 1];

		var midleLeft  = map[currentX][currentY - 1];
		var midleRight = map[currentX][currentY + 1];

		var bottomLeft  = map[currentX + 1][currentY - 1];
		var bottomMidle = map[currentX + 1][currentY];
		var bottomRight = map[currentX + 1][currentY + 1];

		var currentPoint = map[currentX][currentY];
		
		var positionTile;

		/*********** TOP **********/

		/*
		 * Configuration : Top Left
		 * 		[X][X]
		 *   	[X][C]
		 */
		if (currentPoint < topLeft
			&& currentPoint < topMidle
			&& currentPoint < midleLeft) {
			positionTile = "TL";
		}

		/*
		 * Configuration : Top Right
		 * 		[X][X]
		 *   	[C][X]
		 */
		else if (currentPoint < topRight
			&& currentPoint < topMidle
			&& currentPoint < midleRight) {
			positionTile = "TR";
		}

		/*
		 * Configuration : Top Midle
		 * 	 [X][X] ou [X][X]
		 *   	[C]    [C]
		 */
		else if ((currentPoint < topLeft && currentPoint < topMidle)
			|| (currentPoint < topMidle && currentPoint < topRight)) {
			positionTile = "TM";
		}		

		/*********** BOTTOM **********/

		/*
		 * Configuration : Bottom Left
		 * 		[X][C]
		 *   	[X][X]
		 */
		else if (currentPoint < midleLeft
			&& currentPoint < bottomLeft
			&& currentPoint < bottomMidle) {
			positionTile = "BL";
		}

		/*
		 * Configuration : Bottom Right
		 * 		[C][X]
		 *   	[X][X]
		 */
		else if (currentPoint < midleRight
			&& currentPoint < bottomRight
			&& currentPoint < bottomMidle) {
			positionTile = "BR";
		}

		/*
		 * Configuration : Bottom Midle
		 *    	[C]    [C]
		 * 	 [X][X] ou [X][X]
		 */
		else if ((currentPoint < bottomLeft && currentPoint < bottomMidle)
			|| (currentPoint < bottomMidle && currentPoint < bottomRight)) {
			positionTile = "BM";
		}

		/*********** MIDDLE **********/

		/*
		 * Configuration : Midle Left
		 *   	[X][C] ou [X]
		 *   	[X]       [X][C]
		 */
		else if ((currentPoint < topLeft && currentPoint < midleLeft)
			|| (currentPoint < midleLeft && currentPoint < bottomLeft)) {
			positionTile = "ML";
		}

		/*
		 * Configuration : Right
		 * 		   [X] ou [C][X]
		 *   	[C][X]       [X]
		 */
		else if ((currentPoint < topRight && currentPoint < midleRight)
			|| (currentPoint < midleRight && currentPoint < bottomRight)) {
			positionTile = "MR";
		}

		/********** CORNERS *********/

		/*
		 * Configuration : Corner Top Right
		 * 		[O][X]
		 *   	[C][O]
		 */
		else if (topMidle < topRight
			&& currentPoint < topRight
			&& midleRight < topRight) {
			positionTile = "C_TR";
		}

		/*
		 * Configuration : Corner Top Left
		 * 		[X][O]
		 *   	[O][C]
		 */
		else if (topMidle < topLeft
			&& currentPoint < topLeft
			&& midleRight < topLeft) {
			positionTile = "C_TL";
		}

		/*
		 * Configuration : Corner Bottom Right
		 * 		[C][O]
		 *   	[O][X]
		 */
		else if (midleRight < bottomRight
			&& currentPoint < bottomRight
			&& bottomMidle < bottomRight) {
			positionTile = "C_BR";
		}

		/*
		 * Configuration : Corner Bottom Left
		 * 		[O][C]
		 *   	[X][O]
		 */
		else if (midleLeft < bottomLeft
			&& currentPoint < bottomLeft
			&& bottomMidle < bottomLeft) {
			positionTile = "C_BL";
		}

		/********** CAS PARTICULIERS **********/
		/*
		 * Configuration : Midle Right
		 * 		[C][X]
		 */
		else if (currentPoint < midleRight) {
			positionTile = "MR";
		}

		else {
			positionTile = "MM";
		}

		return positionTile;
	}

}