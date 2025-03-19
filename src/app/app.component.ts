import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service'
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports:[RouterOutlet]
})
export class AppComponent implements OnInit {
  usuarios: any[] = [];
  projetos: any[] = [];

  title = 'exemplo';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getUsuarios().subscribe((res) => {
      this.usuarios = res;
      console.log('Usuários:', this.usuarios);
    });

    this.apiService.getProjetos().subscribe((res) => {
      this.projetos = res;
      console.log('Projetos:', this.projetos);
    });
  }
}
