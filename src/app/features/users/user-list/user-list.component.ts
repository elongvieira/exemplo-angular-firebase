import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { RippleModule } from 'primeng/ripple';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/user-model';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, PanelModule, ButtonModule, RippleModule, TableModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {

  users: User[] = [];

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.users = this.userService.getAll();
  }

  delete(id: string) {
    this.userService.remove(id);
    this.users = this.userService.getAll();
  }

}
