import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/user-model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputMaskModule,
    PanelModule,
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {

  userForm: FormGroup;

  user: User | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cellPhone: ['', Validators.required],
    });

    this.loadUser();
  }

  private loadUser() {
    const id = this.activatedRoute.snapshot.params['id'];
    if (id) {
      this.user = this.userService.get(id);
      this.userForm.get('name')?.setValue(this.user?.name);
      this.userForm.get('email')?.setValue(this.user?.email);
      this.userForm.get('cellPhone')?.setValue(this.user?.cellPhone);
    }
  }

  async save() {
    if (!this.userForm.valid) {
      return;
    }

    if (this.user) {
      this.userService.update(this.user.id!, this.userForm.value);
    } else {
      const user = this.userForm.value;
      this.userService.add(user);
    }
    this.userForm.reset();
    this.router.navigate(['/user']);
  }

  getErrorMessage(controlName: string): string {
    const control = this.userForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo é obrigatório.';
    } else if (control?.hasError('email')) {
      return 'Email inválido.';
    }
    return '';
  }
}
