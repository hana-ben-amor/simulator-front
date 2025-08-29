// components/optimize/optimize.component.ts
import { Component } from '@angular/core';
import { OptimizeService, OptimizeRequest, OptimizeResult } from '../services/optimize.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-optimize',
  standalone: true, 
  templateUrl: './optimize.component.html',
  imports: [FormsModule, NgIf, NgFor]
})
export class OptimizeComponent {
  req: OptimizeRequest = {
    cities: [],
    rooms: 'T2',
    surface: 50,
    maxPrice: 200000,
    targetGrossYieldPct: 5
  };

  cityInput = '';
  result?: OptimizeResult;
  loading = false;

  constructor(private optimizeService: OptimizeService) {}

  addCity() {
    if (this.cityInput.trim()) {
      this.req.cities.push(this.cityInput.trim().toUpperCase());
      this.cityInput = '';
    }
  }

  optimize() {
    this.loading = true;
    this.optimizeService.optimize(this.req).subscribe(res => {
      this.result = res;
      this.loading = false;
    });
  }
}
