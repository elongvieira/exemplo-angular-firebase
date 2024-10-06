import { TestBed } from '@angular/core/testing';
import { User } from '../models/user-model';
import { UserService } from '../services/user-service';

describe('UserService', () => {
  let service: UserService;
  let mockUser: User;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
    mockUser = { id: '', name: 'Teste', email: 'teste@example.com', cellPhone: '1234567890' };
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve adicionar um usuário', () => {
    service.add(mockUser);
    expect(sessionStorage.length).toBe(1);
  });

  it('deve obter um usuário', () => {
    service.add(mockUser);
    const storedUser = service.get(mockUser.id!);
    expect(storedUser).toEqual(mockUser);
  });

  it('deve retornar null para um usuário não existente', () => {
    const storedUser = service.get('chave-inexistente');
    expect(storedUser).toBeNull();
  });

  it('deve obter todos os usuários', () => {
    service.add(mockUser);
    service.add({ ...mockUser, id: '', email: 'outro@example.com' });
    const users = service.getAll();
    expect(users.length).toBe(2);
  });

  it('deve atualizar um usuário existente', () => {
    service.add(mockUser);
    const updatedUser = { ...mockUser, name: 'Atualizado' };
    service.update(mockUser.id!, updatedUser);
    const storedUser = service.get(mockUser.id!);
    expect(storedUser).toEqual(updatedUser);
  });

  it('deve exibir um erro ao tentar atualizar um usuário inexistente', () => {
    spyOn(console, 'error');
    service.update('chave-inexistente', mockUser);
    expect(console.error).toHaveBeenCalled();
  });

  it('deve remover um usuário', () => {
    service.add(mockUser);
    service.remove(mockUser.id!);
    expect(sessionStorage.length).toBe(0);
  });
});