export class DatabaseCredentials {
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;

  constructor(user: string, password: string) {
    this.DATABASE_USER = user;
    this.DATABASE_PASSWORD = password;
  }
}
