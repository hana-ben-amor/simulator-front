// src/app/dashboard/dashboard.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';
import { MarketService, RentDataResponse, SimulationResult } from '../services/market.service';
import { AiService } from '../services/ai.service';
import { OptimizeComponent } from "../optimize/optimize.component";

type Role = 'user' | 'assistant';
interface ChatMsg { role: Role; text: string; }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  imports: [FormsModule, CommonModule, OptimizeComponent]
})
export class DashboardComponent implements OnInit {
  @ViewChild('revenueCanvas', { static: false }) revenueCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('scrollArea') private scrollArea!: ElementRef<HTMLDivElement>;
  exploitationType: 'LLD' | 'COURTE' = 'LLD';

  searchTerm = '';
  cities: string[] = [];
  selectedCity = '';
  selectedRooms = 'T1';
  surface = 50;

  simResult?: SimulationResult;
  rentData?: RentDataResponse;

  // === Chat state (une seule déclaration)
  public thread: ChatMsg[] = [
    { role: 'assistant', text: 'Hi! Ask me anything about ROI, rents or yield.' }
  ];
  public draft = '';
  public loading = false;

  private chart?: Chart;

  constructor(private market: MarketService, private ai: AiService) {}

  ngOnInit(): void {
    this.market.getCities().subscribe(cities => {
      this.cities = cities;
      if (cities.length > 0) {
        this.selectedCity = cities[0];
        this.loadData();
      }
    });
      this.startTyping();

  }

  ngAfterViewInit(): void { this.scrollToBottom(); }

  onSearch(e: Event) {
    e.preventDefault();
    const term = (this.searchTerm || '').toUpperCase().trim();
    if (!term) return;
    const found = this.cities.find(c => c.toUpperCase() === term);
    if (found) { this.selectedCity = found; this.loadData(); }
  }

  exportPdf() { window.print(); }
// --- Typewriter intro ---
fullIntro = 'Simulateur de rentabilité ...';
displayedText = '';
private typingIdx = 0;
private typingTimer?: any;
typingSpeedMs = 24;     // vitesse de frappe
startDelayMs  = 200;    // petit délai avant de commencer

private startTyping(): void {
  // éviter plusieurs timers
  if (this.typingTimer) { clearInterval(this.typingTimer); }
  this.displayedText = '';
  this.typingIdx = 0;

  setTimeout(() => {
    this.typingTimer = setInterval(() => {
      if (this.typingIdx < this.fullIntro.length) {
        this.displayedText += this.fullIntro.charAt(this.typingIdx++);
      } else {
        clearInterval(this.typingTimer);
      }
    }, this.typingSpeedMs);
  }, this.startDelayMs);
}

  private scrollToBottom() {
    queueMicrotask(() => {
      if (this.scrollArea) {
        const el = this.scrollArea.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  send() {
    const msg = this.draft.trim();           // <-- plus de ?.trim()
    if (!msg) { return; }

    this.thread.push({ role: 'user', text: msg });
    this.draft = '';
    this.loading = true;
    this.scrollToBottom();

    this.ai.chat({
      message: msg,
      context: {
        system: 'You are a senior analyst for real-estate ROI simulation. Use concise bullets and numbers.',
        city: this.selectedCity,
        rooms: this.selectedRooms,
        surface: this.surface
      }
    }).subscribe({
      next: (res) => {
        this.thread.push({ role: 'assistant', text: res?.answer ?? '—' });
        this.loading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('AI error:', err);
        const msg =
          err?.error?.error?.message ||    // ex. {error:{message:"..."}}
          err?.error?.message ||           // ex. {message:"..."}
          err?.message ||                  // ex. HttpErrorResponse.message
          'AI unavailable.';
        this.thread.push({ role: 'assistant', text: `Sorry, AI error: ${msg}` });
        this.loading = false;
        this.scrollToBottom();
      }
    });
  }

  loadData(): void {
    if (!this.selectedCity) return;

    this.market.simulate({
      price: 250000, surface: this.surface, rooms: this.selectedRooms as any,
      city: this.selectedCity, exploitationType: this.exploitationType 
    }).subscribe(res => {
      this.simResult = res;
      this.upsertChart(res.monthlyRevenue);
    });

    this.market.getRentData(this.selectedCity, this.selectedRooms)
      .subscribe(res => this.rentData = res);
  }
  scrollToSimulation() {
  const el = document.getElementById('simulation');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


  private upsertChart(monthly: number): void {
    const data = [monthly * 0.8, monthly * 0.9, monthly, monthly * 1.1, monthly * 1.2];
    if (this.chart) { this.chart.data.datasets[0].data = data; this.chart.update(); return; }
    if (!this.revenueCanvas) return;

    this.chart = new Chart(this.revenueCanvas.nativeElement.getContext('2d')!, {
      type: 'line',
      data: {
        labels: ['Jan','Feb','Mar','Apr','May'],
        datasets: [{ label: 'Monthly Revenue (€)', data, borderColor: '#0d6efd',
          backgroundColor: 'rgba(13,110,253,0.2)', tension: 0.35, fill: true }]
      },
      options: { plugins: { legend: { display: true } }, scales: { y: { beginAtZero: true } } }
    });
  }
  currentYear = new Date().getFullYear();

contact = { name: '', email: '', message: '' };
sendingContact = false;
contactSent = false;

submitContact() {
  if (!this.contact.name || !this.contact.email || !this.contact.message) return;

  this.sendingContact = true;
  this.contactSent = false;

  // ===== Option immédiate (fallback) : ouverture du client mail =====
  const subject = encodeURIComponent(`Contact Simmo — ${this.contact.name}`);
  const body = encodeURIComponent(
    `${this.contact.message}\n\n---\nNom: ${this.contact.name}\nEmail: ${this.contact.email}`
  );
  window.location.href = `mailto:hanaamor5@gmail.com?subject=${subject}&body=${body}`;

  // Simule un retour OK et réinitialise le formulaire
  setTimeout(() => {
    this.sendingContact = false;
    this.contactSent = true;
    this.contact = { name: '', email: '', message: '' };
  }, 300);
  /* ===== Option API (quand tu auras un endpoint) =====
  this.http.post('/api/contact', this.contact).subscribe({
    next: () => {
      this.sendingContact = false;
      this.contactSent = true;
      this.contact = { name: '', email: '', message: '' };
    },
    error: () => {
      this.sendingContact = false;
      alert('Envoi impossible pour le moment.');
    }
  });
  */
}
}
