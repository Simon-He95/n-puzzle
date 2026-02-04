export interface NumberBlock {
  number: undefined | number
  x: number
  y: number
  animateX: boolean
  animateY: boolean
  moveX?: number
  moveY?: number
  flip?: boolean
  flipAxis?: 'x' | 'y'
}

export interface PictureBlock {
  url: string
  x: number
  y: number
  pos: number
  animateX: boolean
  animateY: boolean
  moveX?: number
  moveY?: number
  flip?: boolean
  flipAxis?: 'x' | 'y'
}
export type GameStaus = 'Easy' | 'Medium' | 'Hard' | 'Evil'
