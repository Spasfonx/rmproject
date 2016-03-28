/**
 * Classe MapGenerator : Génération de map aléatoire
 */
function MapGenerator() {

	const HEIGHTMAP_MAXVALUE = 255;
	const HEIGHTMAP_HALFVALUE = 128;
	const HEIGHTMAP_MINVALUE = 0;
	 
	// const HEIGHTMAP_MAXVALUE = 64;
	// const HEIGHTMAP_HALFVALUE = 32;
	// const HEIGHTMAP_MINVALUE = 0;

	var minValue;
	var maxValue;

	this.generateRandomMap = function(MAP_SIZE, wrap, roughness, radiusBlur) {
		var mapArray = boxBlur(heightmapDiamondSquare(MAP_SIZE, wrap, roughness), radiusBlur);

		var map = new Map();
			map.mapRaw = mapArray;
			map.minValueMap = minValue;
			map.maxValueMap = maxValue;

		return map;
	}

	/**
	 * Génère une heightmap d'après l'algorithme Diamond Square.
	 * @param  {[int]} MAP_SIZE    - Taille de l'heightmap. L'heightmap sera carré et sa taille doit être égale à 2^n + 1.
	 * @param  {[boolean]} wrap    - Génération du bord de la map ? Si faux, cela permet d'afficher la map en la repetant.
	 * @param  {[float]} roughness - Dureté de la map
	 * @return {[Array[int][int]]}           [description]
	 */
	var heightmapDiamondSquare = function(MAP_SIZE, wrap, roughness) {
		var map = [];
		var nw = (wrap ? 0 : 1);

		minValue = HEIGHTMAP_MAXVALUE;
		maxValue = HEIGHTMAP_MINVALUE;

		// Crée un tableau 2D vide, size x size
		for (var i = 0; i < MAP_SIZE; i++) {
			map[i] = [];
		}

		// Initialisation des coins de la carte
		map[0][0]                       = Math.round(Math.random() * HEIGHTMAP_MAXVALUE);
		map[0][MAP_SIZE - 1]            = Math.round(Math.random() * HEIGHTMAP_MAXVALUE);
		map[MAP_SIZE - 1][0]            = Math.round(Math.random() * HEIGHTMAP_MAXVALUE);
		map[MAP_SIZE - 1][MAP_SIZE - 1] = Math.round(Math.random() * HEIGHTMAP_MAXVALUE);

		var h = HEIGHTMAP_HALFVALUE; // La plage (-h -> +h) pour le décalage moyen

		/*
		 * sideLength est la longueur d'un côté d'un carré ou la diagonale d'un losange
		 * sideLength doit toujours être >= 2 car lorsque il est égal à 1 on écrase les valeurs précédentes
		 * A chaque itération on considère les carrés ou les losanges les plus petits et on dimonue
		 * la variation du décalage
		 */
		for (var sideLength = MAP_SIZE - 1; 
				sideLength >= 2; 
				sideLength /= 2, h /= 2.0) {

			// Moitié de la longueur d'un carré/losange
			var halfSide = sideLength / 2;

			/* Génère les nouvelles valeurs du carré */
			for (var x = 0; x < MAP_SIZE - 1; x += sideLength) {
				for (var y = 0; y < MAP_SIZE - 1; y += sideLength) {
					// x, y est en haut à gauche du carré
					// On calcule la moyenne des coins existants
					var avg = map[x][y] + // top left
							map[x + sideLength][y] + // top right
							map[x][y + sideLength] + // lower left
							map[x + sideLength][y + sideLength]; // lower right

					avg /= 4.0;

					// Le centre c'est la moyenne plus un décalage aléatoire
					avg = normalize(avg + offset(h , roughness));

					map[x + halfSide][y + halfSide] = avg;

					updateMinMaxValue(avg);
				}
			}

			/* 
			 * Génère les valeurs du losange 
			 * - Pour x, les losanges sont en quinconce donc on se déplace en x uniquement de halfSide
			 * - "y" est "x" transféré de halfSide, mais translaté de la pleine longueur du côté
			 * - NOTE : Si la carte ne doit pas se répéter alors x < MAP_SIZE - 1, d'où l'utilisation
			 * de la variable nw de façon à générer les valeurs du bord.
			 */
			for (var x = 0; x < MAP_SIZE - 1 + nw; x += halfSide) {
				for (var y = (x + halfSide) % sideLength; 
						y < MAP_SIZE - 1 + nw; 
						y += sideLength) {
					// x, y est le centre du losange
					// Nous devons utiliser le modulo et l'ajout de MAP_SIZE pour la soustraction
					// afin de parcourir cycliquement le tableau pour trouver les coins
					var avg =
						map[(x - halfSide + MAP_SIZE - 1) % (MAP_SIZE - 1)][y] + // Gauche du centre
						map[(x + halfSide) % (MAP_SIZE - 1)][y] + // Droite du centre
						map[x][(y + halfSide) % (MAP_SIZE - 1)] + // Bas du centre
						map[x][(y - halfSide + MAP_SIZE - 1) % (MAP_SIZE - 1)]; // Haut du centre

					avg /= 4.0;

					// Nouvelle valeur = moyenne + décalage aléatoire
					avg = normalize(avg + offset(h , roughness));

					map[x][y] = avg;

					updateMinMaxValue(avg);

					// Si la carte est répétable on duplique les valeurs sur les bords
					if (wrap) {
						if (x == 0) map[MAP_SIZE - 1][y] = avg;
						if (y == 0) map[x][MAP_SIZE - 1] = avg;
					}
				}
			}
			
		} // for sideLength

		return map;
	}

	/**
	 * Floutage de l'heightmap afin de lisser les reliefs en fonction d'un rayon.
	 * @param  {[type]} map    [description]
	 * @param  {[type]} radius [description]
	 * @return {[type]}        [description]
	 */
	var boxBlur = function (map, radius) {
		var dimX = map.length;
		var dimY = map[0].length;

		var result = [];
		var line;
		var val;

		for (var i = 0; i < dimX; i++) {
			line = [];

			for (var j = 0; j < dimY; j++) {
				val = 0;

				for (var iy = j - radius; iy < j + radius + 1; iy++) {
					for (var ix = i - radius; ix < i + radius + 1; ix++) {
						var x = Math.min(dimX - 1, Math.max(0, ix));
						var y = Math.min(dimY - 1, Math.max(0, iy));
						val += map[x][y];
	        		} // for ix
	      		} // for iy

	      		line.push(val / ((radius + radius + 1) * (radius + radius + 1)));
	    	} // for j

	    	result.push(line);
	  } // for i

	  return result;
	} // boxBlur

	/**
	 * Renvoie un décalage aléatoire proportionnel à la hauteur
	 * @param  {int} height - Hauteur
	 * @param  {float} roughness - Dureté
	 * @return {float} Décalage
	 */
	var offset = function(height, roughness) {
		return (Math.random() * 2 - 1) * height * roughness;
	}

	/**
	 * Normalise la valeur pour s'assurer qu'elle reste dans les limites
	 * @param  {int} value - Valeur à normaliser
	 * @return {int} Valeur normalisée
	 */
	var normalize = function(value) {
		return Math.round(
			Math.max(
				Math.min(value, HEIGHTMAP_MAXVALUE), 
				HEIGHTMAP_MINVALUE
			));
	}

	var updateMinMaxValue = function(value) {
		if (value < minValue)
			minValue = value;

		if (value > maxValue)
			maxValue = value;
	}

}