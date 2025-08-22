// src/app/services/ai.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({ providedIn: 'root' })
export class AiService {
  constructor(private http: HttpClient) {}

  chat(payload: ChatPayload) {
  return this.http.post<{answer:string}>('http://localhost:8080/api/ai/chat', payload);
}

}
