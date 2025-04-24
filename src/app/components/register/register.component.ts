import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  data: any = {
    role: 'student',       
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    occupationArea: '',
    formationArea: '',
    participants: []
  };

  constructor(private router: Router) { }

  createAccount(): void {
    console.log('Dados do registro:', this.data);
    if (this.data.role === 'teacher') {
      this.router.navigate(['/teacher/menu']);
    } else {
      this.router.navigate(['/student/menu']);
    }
  }
}
