import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IEmailBEData } from '../app.definitions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  // TODO: Replace localhost with ENV variable for current instance (i.e. staging, production, etc.)
  baseUrl = 'http://localhost:4200/api/v1';

  constructor(private http: HttpClient) {}

  sendEmail(data: IEmailBEData): Observable<any> {
    return this.http.post(`${this.baseUrl}/email`, data);
  }
}
