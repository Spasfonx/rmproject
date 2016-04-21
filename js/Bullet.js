function Bullet() {
	this.tailleImgX = 440;
	this.tailleImgY = 40;
	this.etatSprite = 0;
	this.posX = 0;
	this.posY = 0;
	this.trueX;
	this.trueY;
	this.posXInit = 0;
	this.posYInit = 0;
	this.image = new Image();
	this.degrer;
	this.tailleX = this.tailleImgX / 8;
	this.tailleY = this.tailleImgY;
	this.changerSprite = function() {
		if (this.etatSprite >= 7)
			this.etatSprite = 0;
		else
			this.etatSprite++;
	};
	this.truePos = function() {
		var radians = (Math.PI / 180) * this.degrer;
		var x = this.posX * Math.cos(radians) - this.posY * Math.sin(radians);
		var y = this.posX * Math.sin(radians) + this.posY * Math.cos(radians);

		this.trueX = this.posXInit + x;
		this.trueY = this.posYInit + y;

	}

	this.drawRotatedBullet = function(ctx) {
		ctx.save();

		ctx.translate(this.posXInit, this.posYInit);

		ctx.rotate(this.degrer * (Math.PI / 180));

		
		ctx.drawImage(Bullet.image, (this.tailleX)
				* this.etatSprite, 0,
				this.tailleX,
				this.tailleY,
				this.posX= this.posX -25,
				this.posY, 40, 20);
		ctx.restore();
		this.changerSprite();
	}
}

Bullet.image;

Bullet.loadBullet = function() {
	Bullet.image = new Image();
	Bullet.image.src = Constantes.SRC_BULLET;

}