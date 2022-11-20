class Sprite {
    constructor({position, imageSrc, frameRate = 1, frameBuffer = 10, scale = 1}){
        this.position = position
        this.scale = scale
        this.loaded = false
        this.image = new Image()
        this.image.onload = () => {
            this.width = this.scale * (this.image.width/this.frameRate),
            this.height = this.scale * this.image.height
            this.loaded = true
        }
        this.image.src = imageSrc
        this.frameRate = frameRate
        this.currentFrame = 0
        this.frameBuffer = frameBuffer
        this.elapseFrames = 0
    }
    draw(){

        if(!this.image) return

        const cropbox = {
            position:{
                x:this.currentFrame * (this.image.width/this.frameRate),
                y:0
            },
            width: this.image.width/this.frameRate,
            height: this.image.height,
        }
        c.drawImage(
            this.image, 
            cropbox.position.x, 
            cropbox.position.y, 
            cropbox.width, 
            cropbox.height, 
            this.position.x, 
            this.position.y,
            this.width,
            this.height)

    }

    update(){
        this.draw()
        this.updateFrames()
    }
    updateFrames(){
        this.elapseFrames++
        if (this.elapseFrames % this.frameBuffer === 0){
            if(this.currentFrame < this.frameRate - 1) this.currentFrame++
            else this.currentFrame = 0
        }
    }
}


class Player extends Sprite {
    constructor({position, collisionBlocks, platformCollisionBlocks, imageSrc,frameRate, scale = 0.5, animations}){
        super({imageSrc, frameRate, scale})
        this.position = position
        this.velocity = {
            x:0, y:1
        }
        this.width = 100/4
        this.height = 100/4
        this.collisionBlocks = collisionBlocks
        this.platformCollisionBlocks = platformCollisionBlocks
        this.animations = animations
        this.lastDirection = 'right'

        for(let key in this.animations){
            const image = new Image()
            image.src = this.animations[key].imageSrc

            this.animations[key].image = image
        }
        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }
        
    }
    updateHitbox(){
        this.hitbox = {
            position: {
                // x:this.position.x + 34,
                x:this.position.x + this.width/2 - 6, 
                y:this.position.y + 28
            },
            width: 12,
            height: 25
        }
    }


    switchSprite(key){
        if (!this.loaded || this.image === this.animations[key].image) return
        
        this.currentFrame = 0
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate

    }

    updateCameraBox(){
        this.camerabox = {
            position: {
                x: this.position.x - (200 - this.width)/2,
                y: this.position.y - (80 - this.height)/2,
            },
            width: 200,
            height: 95,
        }
    }

    shouldPanCameraLeft({canvas, camera}){
        const cameraboxRight =this.camerabox.position.x + this.camerabox.width
        if(cameraboxRight >= 576) return

        if(cameraboxRight >= canvas.width/4 + Math.abs(camera.position.x)){
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanCameraRight({canvas, camera}){
        if(this.camerabox.position.x <= 0) return

        if(this.camerabox.position.x <= Math.abs(camera.position.x)){
            camera.position.x -= this.velocity.x
        }
    }
    
    shouldPanCameraDown({canvas, camera}){
        if(this.camerabox.position.y + this.velocity.y<= 0) return

        if(this.camerabox.position.y <= Math.abs(camera.position.y)){
            camera.position.y -= this.velocity.y
        }
    }

    shouldPanCameraUp({canvas, camera}){
        if(this.camerabox.position.y + this.camerabox.height + this.velocity.y>= canvas.height) return

        if(this.camerabox.position.y +this.camerabox.height >= Math.abs(camera.position.y) + canvas.height/4){
            camera.position.y -= this.velocity.y
        }
    }

    update(){
        this.updateFrames()
        this.updateHitbox()
        this.updateCameraBox()
        
        // c.fillStyle = 'rgba(255,255, 0,0.2)'
        // c.fillRect(this.camerabox.position.x, this.camerabox.position.y, this.camerabox.width, this.camerabox.height)

        // //draws out the image
        // c.fillStyle = 'rgba(255,0,255,0.2)'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // //draws out the hitbox
        // c.fillStyle = 'rgba(0,255, 0,0.2)'
        // c.fillRect(this.hitbox.position.x, this.hitbox.position.y, this.hitbox.width, this.hitbox.height)
        
        this.draw()
        
        this.position.x += this.velocity.x
        this.updateHitbox()
        this.checkForHorizontalCollisions()
        this.applyGravity()
        this.updateHitbox()
        this.checkForVerticalCollisions()
    }

    checkCanvasHorizontalCollision(){
        if (this.position.x + 6 + (this.width/2) + this.velocity.x >= 576
        || this.position.x - 6 + (this.width/2) + this.velocity.x <= 0){
            this.velocity.x = 0
        }
    }

    checkForHorizontalCollisions(){
        for (let i = 0; i < this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i]

            if(
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                })
                ){
                if (this.velocity.x > 0){
                    this.velocity.x = 0
                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x = collisionBlock.position.x - offset - 0.01
                    break
                }
                if (this.velocity.x < 0){
                    this.velocity.x = 0
                    const offset = this.hitbox.position.x - this.position.x

                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
                    break
                }
            }
        }
    }

    
    applyGravity(){
        this.velocity.y += gravity
        this.position.y += this.velocity.y
    }

    checkForVerticalCollisions(){

        if(this.hitbox.position.y + this.velocity.y <= 0) {
            this.position.y = -this.height/2

            this.velocity.y=0
        }
        for (let i = 0; i < this.collisionBlocks.length; i++){
            const collisionBlock = this.collisionBlocks[i]

            if(
                collision({
                    object1: this.hitbox,
                    object2: collisionBlock,
                    })
                ){
                if (this.velocity.y > 0){
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    
                    this.position.y = collisionBlock.position.y - offset - 0.01
                    break
                }
                if (this.velocity.y < 0){
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y 

                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
                    break
                }
            }
        }
        //platform collision
        for (let i = 0; i < this.platformCollisionBlocks.length; i++){
            const platformCollisionBlocks = this.platformCollisionBlocks[i]

            if(
                platformCollision({
                    object1: this.hitbox,
                    object2: platformCollisionBlocks,
                    })
                ){
                if (this.velocity.y > 0 ){
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    
                    this.position.y = platformCollisionBlocks.position.y - offset - 0.01
                    break
                }
                // if (this.velocity.y < 0){
                //     this.velocity.y = 0
                //     const offset = this.hitbox.position.y - this.position.y 

                //     this.position.y = platformCollisionBlocks.position.y + platformCollisionBlocks.height - offset + 0.01
                //     break
                // }
            }
        }
    }
}