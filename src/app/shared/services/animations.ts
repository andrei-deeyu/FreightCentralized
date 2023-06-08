import { animate, animation, keyframes, state, style, transition, trigger, useAnimation } from '@angular/animations';

export let bounceOutLeftAnimation = animation(
  animate('0.5s ease-out', keyframes([
    style({
      offset: .2,
      opacity: 1,
      transform: 'translateX(20px)'
    }),
    style({
      offset: 1,
      opacity: 0,
      transform: 'translateX(-100%)'
    }),
])));

export let slide = trigger('slide', [
  transition(':enter', [
    style({ transform: 'translateX(-10px)' }),
    animate(500)
  ]),

  transition(':leave', useAnimation(bounceOutLeftAnimation))
])

export let fadeInAnimation = animation([
  style({ opacity: 0 }),
  animate('{{ duration }} {{ easing }}')
], {
  params: {
    duration: '100ms',
    easing: 'ease-out'
  }
})

export let fadeOutAnimation = animation([
  animate('200ms ease-in', style({ opacity: 0 }))
])

export let fade = trigger('fade', [
  state('void', style({ opacity: 0 })),
  transition(':enter',useAnimation(fadeInAnimation)),
  transition(':leave', useAnimation(fadeOutAnimation))
])

export let fadeOnOff = trigger('fadeOnOff', [
  state('off', style({ opacity: 0, marginRight: '-2rem' })),
  transition('off => on',useAnimation(fadeInAnimation)),
  transition('on => off', useAnimation(fadeOutAnimation))
])


export let expandedCollapsed = trigger('expandedCollapsed', [
  state('collapsed', style({
    height: 0,
    opacity: 0
  })),


  transition('collapsed => expanded', [
    animate('200ms ease-out', style({
      height: '*',
    })),
    animate('100ms', style({ opacity: 1 }))
  ]),
  transition('expanded => collapsed', [
    animate('100ms ease-in', style({ opacity: 0 })),
    animate('200ms ease-in', style({height: 0 }))
  ])
 ])

 export let menuExpandedCollapsed = trigger('menuExpandedCollapsed', [
  state('collapsed', style({
    top: '-104vh',
    opacity: 0
  })),


  transition('collapsed => expanded', [
    style({ top: '3rem' }),
    animate('200ms ease-out', style({ opacity: 1 }))
  ]),
  transition('expanded => collapsed', [
    animate('200ms ease-in', style({ opacity: 0 })),
  ])
 ])