import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(private http: HttpClient) { }

  configUrl = 'http://localhost:3000';

  getConfig() {
    return this.http.get(this.configUrl);
  }
}