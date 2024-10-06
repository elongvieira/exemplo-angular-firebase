import { Injectable } from '@angular/core';
import { User } from '../models/user-model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  public add(user: User): void {
    const id = uuidv4();
    user.id = id;
    const jsonValue = JSON.stringify(user);   
    sessionStorage.setItem(id, jsonValue);
  }

  public get(key: string): User | null {
    const value = sessionStorage.getItem(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  public getAll(): User[] {
    const keys = Object.keys(sessionStorage);
    const users: User[] = [];
    keys.forEach(key => {
      const user = this.get(key);
      if (user) {
        users.push(user);
      }
    });
    return users;
  }

  public update(key: string, user: User): void {
    if (sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, JSON.stringify(user));
    } else {
      console.error(`Item with key "${key}" not found.`);
    }
  }

  public remove(key: string): void {
    sessionStorage.removeItem(key);
  }
}
