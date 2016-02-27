function Sprite(offsetX, offsetY) {

	this.offsetX = offsetX;
	this.offsetY = offsetY;

	this.drawSprite = function(context, posX, posY) {
		context.drawImage(
			Sprite.spriteImage, 
			this.offsetX,
			this.offsetY,
			Constantes.SPRITE_SIZE, 
			Constantes.SPRITE_SIZE,
			posX,
			posY,
			Constantes.TILE_SIZE,
			Constantes.TILE_SIZE
		);
	}

}

Sprite.spriteImage;

Sprite.loadSprite = function() {
	Sprite.spriteImage = new Image();
	Sprite.spriteImage.src = Constantes.IMG_DIRECTORY + "/sprite.png";
}