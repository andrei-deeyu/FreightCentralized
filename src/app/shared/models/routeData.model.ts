export interface RouteData {
  origin: string,
  destination: string,
  distance: number,
  geometry?: {
    origin: {
      lat: number,
      lng: number
    },
    destination: {
      lat: number,
      lng: number
    }
  }
}