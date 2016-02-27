/**
 * Dictionnaire des Tiles.
 * Termes :
 * 		- TL : Top Left
 * 		- MM : Midle Midle
 * 		- BR : Bottom Right
 * 		- C_BR : Corner Bottom Right
 * 		- etc...
 * 		
 * @type {String, Sprite}
 */
var TileSet = {
	"GRASS_TL": new Sprite(Constantes.SPRITE_SIZE * 0, Constantes.SPRITE_SIZE * 0),
	"GRASS_TM": new Sprite(Constantes.SPRITE_SIZE * 1, Constantes.SPRITE_SIZE * 0),
	"GRASS_TR": new Sprite(Constantes.SPRITE_SIZE * 2, Constantes.SPRITE_SIZE * 0),
	"GRASS_ML": new Sprite(Constantes.SPRITE_SIZE * 0, Constantes.SPRITE_SIZE * 1),
	"GRASS_MM": new Sprite(Constantes.SPRITE_SIZE * 1, Constantes.SPRITE_SIZE * 1),
	"GRASS_MR": new Sprite(Constantes.SPRITE_SIZE * 2, Constantes.SPRITE_SIZE * 1),
	"GRASS_BL": new Sprite(Constantes.SPRITE_SIZE * 0, Constantes.SPRITE_SIZE * 2),
	"GRASS_BM": new Sprite(Constantes.SPRITE_SIZE * 1, Constantes.SPRITE_SIZE * 2),
	"GRASS_BR": new Sprite(Constantes.SPRITE_SIZE * 2, Constantes.SPRITE_SIZE * 2),

	"WATER_TL": new Sprite(Constantes.SPRITE_SIZE * 10, Constantes.SPRITE_SIZE * 0),
	"WATER_TM": new Sprite(Constantes.SPRITE_SIZE * 11, Constantes.SPRITE_SIZE * 0),
	"WATER_TR": new Sprite(Constantes.SPRITE_SIZE * 12, Constantes.SPRITE_SIZE * 0),
	"WATER_ML": new Sprite(Constantes.SPRITE_SIZE * 10, Constantes.SPRITE_SIZE * 1),
	"WATER_MM": new Sprite(Constantes.SPRITE_SIZE * 11, Constantes.SPRITE_SIZE * 1),
	"WATER_MR": new Sprite(Constantes.SPRITE_SIZE * 12, Constantes.SPRITE_SIZE * 1),
	"WATER_BL": new Sprite(Constantes.SPRITE_SIZE * 10, Constantes.SPRITE_SIZE * 2),
	"WATER_BM": new Sprite(Constantes.SPRITE_SIZE * 11, Constantes.SPRITE_SIZE * 2),
	"WATER_BR": new Sprite(Constantes.SPRITE_SIZE * 12, Constantes.SPRITE_SIZE * 2),

	"WATER_C_BR": new Sprite(Constantes.SPRITE_SIZE * 13, Constantes.SPRITE_SIZE * 0),
	"WATER_C_BL": new Sprite(Constantes.SPRITE_SIZE * 14, Constantes.SPRITE_SIZE * 0),
	"WATER_C_TR": new Sprite(Constantes.SPRITE_SIZE * 13, Constantes.SPRITE_SIZE * 1),
	"WATER_C_TL": new Sprite(Constantes.SPRITE_SIZE * 14, Constantes.SPRITE_SIZE * 1),
};