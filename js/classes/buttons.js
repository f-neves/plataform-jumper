const buttonLeft = document.querySelector('.buttonLeft')
const buttonRight = document.querySelector('.buttonRight')
const buttonUp = document.querySelector('.buttonUp')

buttonLeft.addEventListener('touchstart', () => {
  keys.a.pressed = true        

})
buttonLeft.addEventListener('touchend', () => {
  keys.a.pressed = false
})

buttonRight.addEventListener('touchstart', () => {
  keys.d.pressed = true  
})

buttonRight.addEventListener('touchend', () => {
  keys.d.pressed = false
})

buttonUp.addEventListener('touchstart', () => {
  if(player.velocity.y === 0)
  player.velocity.y = -5
})

