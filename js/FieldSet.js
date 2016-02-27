/**
 * Ensemble des types de terrain
 * @type {Enum}
 */
var FieldSet = {
	WATER: 0,
	SAND: 1,
	GRASS: 2,

	properties: {
		0: {name: "WATER", isTraversable: false},
		1: {name: "SAND", isTraversable: true},
		2: {name: "GRASS", isTraversable: true}
	}
};