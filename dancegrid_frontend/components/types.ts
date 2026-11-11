export type DancerShape =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "pentagon";

export type Role = "leader" | "follower";

export interface Dancer {
  name: string;
  shape: DancerShape;
  /** HEX value, e.g. "#ff8800" */
  color: string;
}

export interface Couple {
  number: number;
  leader: Dancer;
  follower: Dancer;
}

export interface Picture {
  id: string;
  title: string;
  comment?: string;
  order: number;
  coordinates: DancerPosition[];
}

export interface DancerPosition {
  coupleNumber: number;
  role: Role;
  x: number;
  y: number;
}
