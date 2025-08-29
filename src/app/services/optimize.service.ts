// services/optimize.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
const BASE = environment.API_URL.replace(/\/+$/, ''); // '/api' en prod, sans slash final

export interface OptimizeRequest {
  cities: string[];
  rooms: string;
  surface: number;
  maxPrice: number;
  targetGrossYieldPct: number;
}

export interface OptimizeResult {
  city: string;
  price: number;
  rentPerM2: number;
  monthlyRevenue: number;
  grossYieldPct: number;
  explanation: string;
}

@Injectable({ providedIn: 'root' })
export class OptimizeService {
  private apiUrl = '/api/optimize';

  constructor(private http: HttpClient) {}

  optimize(req: OptimizeRequest): Observable<OptimizeResult> {
    return this.http.post<OptimizeResult>(`${BASE}/optimize`, req);
  }
}
