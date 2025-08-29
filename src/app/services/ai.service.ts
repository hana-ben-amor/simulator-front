// src/app/services/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ChatPayload {
  message: string;
  context?: {
    system?: string;
    city?: string;
    rooms?: string;
    surface?: number;
  };
}
export interface ChatResponse { answer: string; }

const BASE = environment.API_URL.replace(/\/+$/, ''); // '/api' en prod, sans slash final

@Injectable({ providedIn: 'root' })
export class AiService {
  constructor(private http: HttpClient) {}

  chat(payload: ChatPayload) {
    return this.http.post<ChatResponse>(`${BASE}/ai/chat`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
