import { Point } from './point.model';

export class Parking {
  constructor(
    public id: number,
    public center: Point,
    public address: string,
    public description: string,
    public city_id?: number,
  ) {}
}
