import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
   
 
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${btoa("admin:admin")}`
        }
      });
    

    return next.handle(request);
  }
}
