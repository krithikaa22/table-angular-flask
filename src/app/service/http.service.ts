import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, retry } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  response = {};

  apiUrl = "http://192.168.73.19:105"

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Allow': "PUT"
    })
  }

  constructor(private http: HttpClient, private router: Router) { }
  repos = {}
  public getColumns(){

    return this.http.get<[]>(`${this.apiUrl}/getcolumn`)
  }

  public getFiltered(val : boolean){
    let params = new HttpParams().set("val", val)
    return this.http.get(`${this.apiUrl}/filter`, {params})
  }

  public getData(){
    return this.http.get<[]>(this.apiUrl)
  }

  public search(attr: string, val:any){
    let params = new HttpParams().set("attr", attr).set('val', val)
    console.log(params)
    return this.http.get(`${this.apiUrl}/search`, {params})
  }

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return error
  }
}
