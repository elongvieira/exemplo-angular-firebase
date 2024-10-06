import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserService } from '../../../services/user-service';
import { User } from '../../../models/user-model';
import { of } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    userServiceMock = jasmine.createSpyObj('UserService', ['getAll', 'remove']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve carregar usuários no ngOnInit', () => {
    const mockUsers: User[] = [
      { id: '1', name: 'Usuário 1', email: 'usuario1@example.com', cellPhone: '1234567890' },
      { id: '2', name: 'Usuário 2', email: 'usuario2@example.com', cellPhone: '1234567890' }
    ];
    userServiceMock.getAll.and.returnValue(mockUsers);

    component.ngOnInit();

    expect(component.users).toEqual(mockUsers);
    expect(userServiceMock.getAll).toHaveBeenCalled();
  });

  it('deve deletar um usuário e atualizar a lista', () => {
    const mockUsers: User[] = [
      { id: '1', name: 'Usuário 1', email: 'usuario1@example.com', cellPhone: '1234567890' },
      { id: '2', name: 'Usuário 2', email: 'usuario2@example.com', cellPhone: '1234567890' }
    ];
    const updatedMockUsers: User[] = [{ id: '2', name: 'Usuário 2', email: 'usuario2@example.com', cellPhone: '1234567890' }];
    userServiceMock.getAll.and.returnValues(mockUsers, updatedMockUsers);

    component.ngOnInit();
    component.delete('1');

    expect(userServiceMock.remove).toHaveBeenCalledWith('1');
    expect(userServiceMock.getAll).toHaveBeenCalledTimes(2);
    expect(component.users).toEqual(updatedMockUsers);
  });
});