﻿import { Injectable } from '@angular/core';

export enum TokenType {
  AccesToken,
  RefreshToken
}


@Injectable()
export class AuthTokenStorageService {

  constructor() { }

  public getToken(name: string): string {
    return localStorage.getItem(name);
  }

  public setToken(name: string, value: string) {
    localStorage.setItem(name, value);
  }

  public removeToken(name: string): void {
    localStorage.removeItem(name);
  }

  public setExp(exp: number) {
    localStorage.setItem('exp', exp.toString());
  }

  public getExp(): number {
    return parseInt(localStorage.getItem('exp'), 10);
  }

  public removeExp(): void {
    localStorage.removeItem('exp');
  }

  private getTokenName(tokenType: TokenType): string {
    return tokenType === TokenType.AccesToken
      ? 'id_token'
      : 'refresh_token';
  }
}