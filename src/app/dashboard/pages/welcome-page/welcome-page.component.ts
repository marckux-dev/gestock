import {Component, inject, OnInit} from '@angular/core';
import {MaterialModule} from '../../../material/material/material.module';
import {Center} from '../../../features/centers/interfaces/center.interface';
import {CentersService} from '../../../features/centers/services/centers.service';
import {RouterLink} from '@angular/router';
import {LowerCasePipe, NgForOf} from '@angular/common';

@Component({
  selector: 'dashboard-welcome-page',
  imports: [MaterialModule, RouterLink, NgForOf, LowerCasePipe],
  templateUrl: './welcome-page.component.html',
  standalone: true,
  styles: ``
})
export class WelcomePageComponent implements OnInit {

  private centersService: CentersService = inject(CentersService);
  centers: Center[] = [];

  ngOnInit(): void {
    this.centersService.getAll().subscribe(centers => {
      this.centers = centers;
    });
  }
}
