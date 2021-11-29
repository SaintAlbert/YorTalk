// Angular Modules 
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
export class ApiHttpService {
  constructor(
    // Angular Modules 
    private http: HttpClient
  ) { }

  header() {
    var headers_object = new HttpHeaders();
    headers_object.append('Content-Type', 'application/json');
    headers_object.append("Authorization", "Basic " + btoa("admin:admin"));

    const httpOptions = {
      headers: headers_object
    };

    return httpOptions;
  }
  public get(url: string, options?: any) {
    return this.http.get(url, options);
  }
  public post(url: string, data: any, options?: any) {
    return this.http.post(url, data, options);
  }
  public put(url: string, data: any, options?: any) {
    return this.http.put(url, data, options);
  }
  public delete(url: string, options?: any) {
    return this.http.delete(url, options);
  }
}



@Injectable()
export class Constants {
  public static API_ENDPOINT: string = 'http://127.0.0.1:8000/api';
}
