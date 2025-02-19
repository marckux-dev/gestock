import {Component, computed, inject, OnInit, Signal, ViewChild} from '@angular/core';
import {AuthService} from '../../../../auth/services/auth.service';
import {CommonModule} from '@angular/common';
import {MaterialModule} from '../../../../material/material/material.module';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {ExpansionPanelComponent} from '../../../../shared/components/expansion-panel/expansion-panel.component';
import {ExpansionPanelAComponent} from '../../../../shared/components/expansion-panel-a/expansion-panel-a.component';
import {CentersService} from '../../../../features/centers/services/centers.service';
import {Center} from '../../../../features/centers/interfaces/center.interface';
import {ScreenSizeService} from '../../../../shared/services/screen-size.service';
import {MatDrawer} from '@angular/material/sidenav';
import {User} from '../../../../auth/interfaces/user';
import {Role} from '../../../../auth/interfaces/role.enumeration';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    CommonModule,
    MaterialModule,
    RouterOutlet,
    ExpansionPanelComponent,
    RouterLink,
    ExpansionPanelAComponent,
  ],
  templateUrl: './dashboard-layout.component.html',
  standalone: true,
  styles: ``
})
export class DashboardLayoutComponent implements OnInit {

  // Dependency Injection
  private screenSizeService: ScreenSizeService = inject(ScreenSizeService);
  private router           : Router            = inject(Router);
  private authService      : AuthService       = inject(AuthService);
  private centersService   : CentersService    = inject(CentersService);

  // Signals
  isDesktop: Signal<boolean>     = this.screenSizeService.isDesktop;
  user     : Signal<User | null> = this.authService.user;
  isAdmin  : Signal<boolean>     = this.authService.isAdmin;

  centers: Center[] = [];

  @ViewChild('drawer') drawer!: MatDrawer;

  ngOnInit(): void {
    this.centersService.getAll()
      .subscribe(centers=>{
        this.centers=centers
      });
  }

  closeDrawer(): void {
    setTimeout(() => {
      if(!this.isDesktop()) {
        this.drawer.close();
      }
    }, 200);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['auth', 'login']);
  }

  protected readonly Role = Role;
}
