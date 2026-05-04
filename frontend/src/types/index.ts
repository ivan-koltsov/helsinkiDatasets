export interface Zone {
  id: number;
  name: string;
  municipality: string;
  lat: number;
  lon: number;
}

export interface Dataset {
  id: number;
  name: string;
  description: string;
  provider: string;
}

export interface Coverage {
  zone_id: number;
  dataset_id: number;
  last_updated: string;
  dataset_name?: string;
  zone_name?: string;
}

export type Freshness = 'fresh' | 'ageing' | 'stale';
