import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Server, server } from '@models/http'

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  title = 'tach';

  constructor(http: HttpClient) {
    http.get('assets/server.json').subscribe((data: Server) => server.host = data.host);
  }
}