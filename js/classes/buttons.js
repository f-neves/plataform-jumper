
  const buttonLeft = document.querySelector('.buttonLeft')
  const buttonRight = document.querySelector('.buttonRight')
  const buttonUp = document.querySelector('.buttonUp')
  const buttonAttack = document.querySelector('.buttonAttack')
  const teste = document.querySelector('.teste')
  

  buttonLeft.addEventListener('touchstart', () => {
    keys.a.pressed = true  
    player.lastKey = 'a'          
    
  })
  
  buttonLeft.addEventListener('touchend', () => {
    keys.a.pressed = false
    player.lastKey = 'a'          
    
  })
  
  buttonRight.addEventListener('touchstart', () => {
    keys.d.pressed = true  
    player.lastKey = 'd'          
  })
  
  buttonRight.addEventListener('touchend', () => {
    keys.d.pressed = false
    player.lastKey = 'd'          
  })
  
  buttonUp.addEventListener('touchstart', () => {
    keys.w.pressed = true  
    if (player.position.y + player.height>=canvas.height-ground)
    player.velocity.y = -20 
    player.lastKey = 'w'          
  })
  
  buttonUp.addEventListener('touchend', () => {
    keys.w.pressed = false
    player.lastKey = 'w'          
  })
  
  buttonAttack.addEventListener('touchstart', () => {
    player.attack()
  })
  
  
