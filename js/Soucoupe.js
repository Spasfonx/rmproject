function Soucoupe() {
	this.posX = 0;
	this.posY = 0;
	this.vitesse = 15;
	this.vie = 5;
	this.direction = "h";
	this.img = new Image();
	this.tailleX = 100;
	this.tailleY = 100;
	this.soucoupeImagevie = new Image();
	this.posInitX;
	this.uneTourelle = new Tourelle;
	this.uneTourelle.posX = this.posX + 50 * 0.64;
	this.uneTourelle.posY = this.posY + 50 * 0.64;

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
		this.drawLife(leCtx);

	}
	this.drawLife = function(leCtx) {
		var i;
		for (i = 0; i < this.vie; i++) {
			leCtx.drawImage(this.soucoupeImagevie, this.posInitX + i * 30, 20,
					50, 60);
		}
	}
	this.testDamage = function(Soucoupe) {
		for (i = 0; i < Soucoupe.uneTourelle.lesBullet.length; i++) {
			uneBullet = Soucoupe.uneTourelle.lesBullet[i];

			if (uneBullet) {
				uneBullet.truePos();
				if ((uneBullet.trueX  >= this.posX)
						&& (uneBullet.trueX  <= this.posX + Constantes.TILE_SIZE)
						&& (uneBullet.trueY - 20 >= this.posY)
						&& (uneBullet.trueY - 20 <= this.posY + Constantes.TILE_SIZE)) {
					alert("La balle touche");
					this.vie = this.vie - uneBullet.damage;
					Soucoupe.uneTourelle.lesBullet[i] = null;
				}
			}
		}
	}
	
	
	this.initPosTourelle = function (){
		this.uneTourelle.posX = this.posX + 50 * 0.64;
		this.uneTourelle.posY = this.posY + 50 * 0.64;
	}

}

Soucoupe.image;
Soucoupe.imagemorty;
Soucoupe.imagerick;

Soucoupe.loadSoucoupe = function() {
	Soucoupe.image = new Image();
	Soucoupe.imagerick = new Image();
	Soucoupe.imagemorty = new Image();
	Soucoupe.image.src = Constantes.SRC_SOUCOUPE;
	Soucoupe.imagerick.src = Constantes.SRC_RICK;
	Soucoupe.imagemorty.src = Constantes.SRC_MORTY;
}
