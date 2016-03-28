function Tourelle() {

	this.posX;
	this.posY;
	this.niveau = 0;
	this.tailleImgX = 158;
	this.tailleImgY = 12;
	this.img = new Image();
	this.tailleX = this.tailleImgX;
	this.tailleY = this.tailleImgY;
	this.lesBullet = [];
	this.nbBullet = 0;
	this.canShot = true;
	this.degre = 0;
	this.tirer = function() {

		if (this.canShot) {
			this.canShot = false;
			this.lesBullet[this.nbBullet] = new Bullet;
			this.lesBullet[this.nbBullet].posX = -105*0.64;
			this.lesBullet[this.nbBullet].posY = -10*0.64;
			this.lesBullet[this.nbBullet].posXInit = this.posX;

			this.lesBullet[this.nbBullet].posYInit = this.posY;
			this.lesBullet[this.nbBullet].degrer = this.degre;
			this.nbBullet++;

			setTimeout(this.canShotReverse, 2000);
		}

	};

	this.canShotReverse = function() {

		this.canShot = true;
	};

	this.drawTourelle = function(leCtx) {
		// save the current co-ordinate system
		// before we screw with it
		leCtx.save();

		// move to the middle of where we want to draw our image
		leCtx.translate(this.posX, this.posY);

		// rotate around that point, converting our
		// angle from degrees to radians
		leCtx.rotate(this.degre * (Math.PI / 180));

		// draw it up and to the left by half the width
		// and height of the image
		leCtx.drawImage(Tourelle.image, -(this.tailleImgX*0.64)/2, -5,this.tailleImgX*0.64 -30,10);
		leCtx.restore();
		
		for(var i=0;i<this.nbBullet;i++)
		this.lesBullet[i].drawRotatedBullet(leCtx);
		
	}
}


Tourelle.image;

Tourelle.loadTourelle=function(){
	Tourelle.image=new Image();
	Tourelle.image.src=Constantes.SRC_TOURELLE;
}