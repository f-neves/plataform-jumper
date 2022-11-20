class CollisionBlock {
    constructor({position, height = 16}){
        this.position = position
        this.width = 16
        this.height = height
    }
    draw(){
        c.fillStyle = 'rgba(255, 0, 0, 0.6)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
    }
}

class PlatformCollisionBlock {
    constructor({position}){
        this.position = position
        this.width = 16
        this.height = 4
    }
    draw(){
        c.fillStyle = 'rgba(255, 0, 0, 0.2)'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update(){
        this.draw()
    }
}