import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent }, // 🚀 sans le slash
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
  { path: '**', redirectTo: 'dashboard' }
];
