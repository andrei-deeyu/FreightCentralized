export interface RouteData {
  origin: string,
  destination: string,
  distance: number,
  geometry?: {
    origin: object,
    destination: object
  }
}