class Boundary {
    static width = 88;
    static height = 88;
    constructor({position}) {
        this.position = position;
        this.width = 88;
        this.height = 88;
    };

    draw() {
        context.fillStyle = 'rgba(255, 0, 0, 0)';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    };
}

class Trigger {
    static width = 88;
    static height = 88;
    constructor({position}) {
        this.position = position;
        this.width = 88;
        this.height = 88;
    };

    draw() {
        context.fillStyle = 'rgba(0, 0, 255, 1)';
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    };
}

class Sprite {
    constructor({position, velocity, image, frames = {max: 1}, scale = {max: 1}, sprites}) {
        this.position = position;
        this.image = image;
        this.frames = {...frames, val: 0, elapsed: 0};
        this.scale = scale;
        
        this.image.onload = () => {
            this.width = this.image.width / this.frames.max * this.scale.max;
            this.height = this.image.height * this.scale.max; 
        };
        this.moving = false;
        this.sprites = sprites;
    };

    draw() {
        context.drawImage(
            this.image,
            this.frames.val * this.width / this.scale.max,
            0,
            this.image.width / this.frames.max,
            this.image.height,
            this.position.x,                                  
            this.position.y,                                
            this.width,           
            this.height
        );

        if (!this.moving) return

        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % 20 === 0) {
            if (this.frames.val < this.frames.max - 1) {
                this.frames.val++;
            } else {
                this.frames.val = 0;
            };  
        }
        
    };
}

