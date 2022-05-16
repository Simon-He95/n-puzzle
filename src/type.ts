export type NumberBlock = {
  number: undefined | number;
  x: number;
  y: number;
  animateX: boolean;
  animateY: boolean;
};

export type PictureBlock = {
  url: string;
  x: number;
  y: number;
  pos: number;
  animateX: boolean;
  animateY: boolean;
};
export type GameStaus = "Easy" | "Medium" | "Hard" | "Evil"
