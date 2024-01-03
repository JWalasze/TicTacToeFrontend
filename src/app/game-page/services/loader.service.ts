import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loading = false;

  private message: string;

  enableLoadingWithMessage(message: string): void {
    this.enableLoading();
    this.setMessage(message);
  }

  enableLoading(): void {
    this.loading = true;
  }

  disableLoading(): void {
    this.loading = false;
  }

  getLoading(): boolean {
    return this.loading;
  }

  setMessage(message: string): void {
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }
}
