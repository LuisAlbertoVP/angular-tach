import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from '@auth_service/*';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken: string = this.auth.token;
    if(authToken) {
      const authReq = req.clone({ setHeaders: { 'Authorization': 'Bearer ' + authToken } });
      return next.handle(authReq);
    }
    return next.handle(req);
  }
}
