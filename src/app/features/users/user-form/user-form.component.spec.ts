import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/user-model';
import { ActivatedRouteSnapshot } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let routerMock: jasmine.SpyObj<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['get', 'update', 'add']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteMock = {
      snapshot: {
        params: {}
      } as ActivatedRouteSnapshot
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UserFormComponent, NoopAnimationsModule],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar o formulário com campos vazios', () => {
    expect(component.userForm.get('name')?.value).toBe('');
    expect(component.userForm.get('email')?.value).toBe('');
    expect(component.userForm.get('cellPhone')?.value).toBe('');
  });

  it('deve carregar os dados do usuário quando um ID é fornecido', () => {
    const mockUser: User = { id: '1', name: 'Teste', email: 'teste@email.com', cellPhone: '123456789' };
    userServiceMock.get.and.returnValue(mockUser);
    activatedRouteMock.snapshot!.params['id'] = '1';

    component.ngOnInit();

    expect(component.user).toEqual(mockUser);
    expect(component.userForm.get('name')?.value).toBe(mockUser.name);
    expect(component.userForm.get('email')?.value).toBe(mockUser.email);
    expect(component.userForm.get('cellPhone')?.value).toBe(mockUser.cellPhone);
  });

  it('deve atualizar um usuário existente', () => {
    const mockUser: User = { id: '1', name: 'Teste', email: 'teste@email.com', cellPhone: '123456789' };
    component.user = mockUser;
    component.userForm.setValue({
      name: 'Novo Nome',
      email: 'novo@email.com',
      cellPhone: '987654321'
    });

    component.save();

    expect(userServiceMock.update).toHaveBeenCalledWith('1', jasmine.any(Object));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/user']);
  });

  it('deve adicionar um novo usuário', () => {
    component.userForm.setValue({
      name: 'Novo Usuário',
      email: 'novo@email.com',
      cellPhone: '123456789'
    });

    component.save();

    expect(userServiceMock.add).toHaveBeenCalledWith(jasmine.any(Object));
    expect(routerMock.navigate).toHaveBeenCalledWith(['/user']);
  });

  it('não deve salvar quando o formulário é inválido', () => {
    component.userForm.setValue({
      name: '',
      email: 'emailinvalido',
      cellPhone: ''
    });

    component.save();

    expect(userServiceMock.add).not.toHaveBeenCalled();
    expect(userServiceMock.update).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('deve retornar mensagens de erro corretas', () => {
    const nameControl = component.userForm.get('name');
    const emailControl = component.userForm.get('email');

    nameControl?.setErrors({ required: true });
    expect(component.getErrorMessage('name')).toBe('Este campo é obrigatório.');

    emailControl?.setErrors({ email: true });
    expect(component.getErrorMessage('email')).toBe('Email inválido.');
  });
});
