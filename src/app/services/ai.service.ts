// src/app/services/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatPayload {
  message: string;
  context?: {
    system?: string;   // <-- string simple, pas un littéral
    city?: string;
    rooms?: string;
    surface?: number;
  };
}

export interface ChatResponse {
  answer: string;
}
const BASE = environment.API_URL.replace(/\/+$/, ''); 

@Injectable({ providedIn: 'root' })
export class AiService {
  constructor(private http: HttpClient) {}

  chat(payload: ChatPayload) {
  return this.http.post<{answer:string}>('${BASE}/ai/chat', payload);
}

}
