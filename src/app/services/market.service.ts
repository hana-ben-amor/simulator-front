import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RentDataResponse {
  city: string;
  rentPerM2: number;
  source: string;
  fetchedAt?: string;
}

export interface SimulationRequest {
  price: number;
  surface: number;
  rooms: 'STUDIO' | 'T1' | 'T2' | 'T3' | 'T4';
  city: string;
  exploitationType: 'LLD' | 'COURTE';
}

export interface SimulationResult {
  totalInvestment: number;
  monthlyRevenue: number;
  grossYieldPct: number;
  dataSource: string;
}

const BASE = environment.API_URL.replace(/\/+$/, ''); 
@Injectable({ providedIn: 'root' })
export class MarketService {
  constructor(private http: HttpClient) {}

  getCities(): Observable<string[]> {
    return this.http.get<string[]>(`${BASE}/cities`);
  }

  getRentData(city: string, rooms: string): Observable<RentDataResponse> {
    const params = new HttpParams().set('city', city).set('rooms', rooms);
    return this.http.get<RentDataResponse>(`${BASE}/rent-data`, { params });
  }

  simulate(body: SimulationRequest): Observable<SimulationResult> {
    return this.http.post<SimulationResult>(`${BASE}/simulate`, body);
  }
}
