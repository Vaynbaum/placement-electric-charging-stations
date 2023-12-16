import { Point } from './point.model';
import { Polygon } from './polygon.model';
import { Region } from './region.model';

export class City {
  constructor(
    public name: string,
    public type: string,
    public north: number,
    public south: number,
    public east: number,
    public west: number,
    public region_id: number,
    public display_name: string,
    public importance: number,
    public center: Point,
    public border: Polygon,
    public is_top?: boolean,
    public id?: number
  ) {}
}

export class FullCity extends City {
  constructor(
    name: string,
    type: string,
    north: number,
    south: number,
    east: number,
    west: number,
    region_id: number,
    display_name: string,
    importance: number,
    center: Point,
    border: Polygon,
    is_top?: boolean,
    id?: number,
    public region?: Region
  ) {
    super(
      name,
      type,
      north,
      south,
      east,
      west,
      region_id,
      display_name,
      importance,
      center,
      border,
      is_top,
      id
    );
  }
}
