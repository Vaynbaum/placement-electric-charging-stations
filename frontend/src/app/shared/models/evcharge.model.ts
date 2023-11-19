import { Point } from './point.model';

export class EVStation {
  constructor(
    public id: number,
    public center: Point,
    public address: any,
    public operator: any,
    public data_provider: any,
    public usage_type: any,
    public сonnections: any,
    public status_type: any,
    public submission_status_type: any,
    public number_points: number,
    public external_id: any,
    public region_id: number,
    public city_id?: number,
    public cost?: string
  ) {}
}
