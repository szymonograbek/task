export interface HeightMessage {
  action: 'height-change'
  payload: number
}

export interface ResizeMessage {
  action: 'resize'
}
