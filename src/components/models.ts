export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface Category {
  id: number;
  type: string;
  key: string;
  value: string;
  images: Array<string>;
}
