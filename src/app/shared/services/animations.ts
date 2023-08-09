import { animate, animation, keyframes, state, style, transition, trigger, useAnimation } from '@angular/animations';

export const bounceOutLeftAnimation = animation(
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

export const slide = trigger('slide', [
  transition(':enter', [
    style({ transform: 'translateX(-10px)' }),
    animate(500)
  ]),

  transition(':leave', useAnimation(bounceOutLeftAnimation))
])

export const fadeInAnimation = animation([
  style({ opacity: 0 }),
  animate('{{ duration }} {{ easing }}')
], {
  params: {
    duration: '100ms',
    easing: 'ease-out'
  }
})

export const fadeOutAnimation = animation([
  animate('200ms ease-in', style({ opacity: 0 }))
])

export const fade = trigger('fade', [
  state('void', style({ opacity: 0 })),
  transition(':enter',useAnimation(fadeInAnimation)),
  transition(':leave', useAnimation(fadeOutAnimation))
])

export const fadeOnOff = trigger('fadeOnOff', [
  state('off', style({ opacity: 0, marginRight: '-2rem' })),
  transition('off => on',useAnimation(fadeInAnimation)),
  transition('on => off', useAnimation(fadeOutAnimation))
])


export const expandedCollapsed = trigger('expandedCollapsed', [
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

 export const menuExpandedCollapsed = trigger('menuExpandedCollapsed', [
  state('collapsed', style({
    top: '-104vh',
    opacity: 0
  })),


  transition('collapsed => expanded', [
    style({ top: '4rem' }),
    animate('200ms ease-out', style({ opacity: 1 }))
  ]),
  transition('expanded => collapsed', [
    animate('200ms ease-in', style({ opacity: 0 })),
  ])
 ])


 export const popUpAlert = trigger('popUpAlert', [
  state('collapsed', style({
    marginTop: '-104vh',
    opacity: 0
  })),


  transition('collapsed => expanded', [
    style({ marginTop: 0 }),
    animate('400ms ease-out', style({ opacity: 1 }))
  ]),
  transition('expanded => collapsed', [
    animate('400ms ease-in', style({ opacity: 0 })),
    style({ marginTop: '-104vh'})
  ])
 ])

 export const postDeleted = trigger('postDeleted', [
  state('off', style({
    marginTop: '-104vh',
    width: 0,
    opacity: 0
  })),

  transition('off => on', [
    style({ marginTop: '*', width: '*' }),
    animate('400ms ease-out', style({ opacity: 1 }))
  ]),
  transition('on => off', [
    animate('400ms ease-in', style({ opacity: 0 })),
    style({ marginTop: '-104vh', width: 0 })
  ])
])