import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public pageTitle: string;
  public pageSubTitle: string;

  constructor() {
    this.pageTitle = 'Bienvenido al foro de programación';
    this.pageSubTitle = 'El foro se encuentra en fase alpha'
   }

  ngOnInit() {
  }

}
