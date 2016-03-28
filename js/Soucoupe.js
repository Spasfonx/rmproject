function Soucoupe() {
	this.posX = 0;
	this.posY = 0;
	this.vitesse = 15;
	this.vie;
	this.direction = "h";
	this.img = new Image();
	this.tailleX = 100;
	this.tailleY = 100;
	this.uneTourelle = new Tourelle;
	this.uneTourelle.posX = this.posX+	50 * 0.64;
	this.uneTourelle.posY = this.posY+	50 * 0.64;
	this.deplacer = function() {
		if (this.direction === 'h') {
			this.posY -= this.vitesse;
		} else if (this.direction === 'b') {
			this.posY += this.vitesse;
		} else if (this.direction === 'g') {
			this.posX -= this.vitesse;

		} else if (this.direction === 'd') {
			this.posX += this.vitesse;
		}

		this.uneTourelle.posX = this.posX + 50 * 0.64;
		this.uneTourelle.posY = this.posY + 50 * 0.64;
	};

	this.gauche = function() {
		this.direction = "g";
		this.deplacer();
	};

	this.droite = function() {
		this.direction = "d";
		this.deplacer();
	};

	this.haut = function() {
		this.direction = "h";
		this.deplacer();
	};

	this.bas = function() {
		this.direction = "b";
		this.deplacer();

	};

	this.drawSoucoupe = function(leCtx) {
		this.uneTourelle.drawTourelle(leCtx);
		leCtx.drawImage(Soucoupe.image, this.posX, this.posY,
				Constantes.TILE_SIZE, Constantes.TILE_SIZE);
		
	}

}

Soucoupe.image;

Soucoupe.loadSoucoupe = function() {
	Soucoupe.image = new Image();
	Soucoupe.image.src = Constantes.SRC_SOUCOUPE;
}
