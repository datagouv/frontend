export type Position = 'top' | 'bottom' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left'

const POSITIONS: Readonly<Record<string, Position>> = {
  TOP_RIGHT: 'top-right',
  TOP: 'top',
  TOP_LEFT: 'top-left',
  BOTTOM_RIGHT: 'bottom-right',
  BOTTOM: 'bottom',
  BOTTOM_LEFT: 'bottom-left',
}

export default POSITIONS

export function definePosition<T>(position: Position, top: T, bottom: T): T {
  let result = top
  switch (position) {
    case POSITIONS.TOP:
    case POSITIONS.TOP_RIGHT:
    case POSITIONS.TOP_LEFT:
      result = top
      break

    case POSITIONS.BOTTOM:
    case POSITIONS.BOTTOM_RIGHT:
    case POSITIONS.BOTTOM_LEFT:
      result = bottom
      break
  }
  return result
}
