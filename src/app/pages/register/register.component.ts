import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule,  CommonModule],
})
export class RegisterComponent {
  userType: 'student' | 'teacher' = 'student';

  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    educationInstitution: '',
    description: '',
    formation: '',
  };

  constructor(private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) {
      console.warn('Formulário inválido!', this.formData);
      return;
    }
  
    if (this.formData.password !== this.formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    localStorage.setItem('userType', this.userType);
    localStorage.setItem('userName', this.formData.name); 
  
    console.log('Usuário registrado com sucesso:', this.formData);
    this.router.navigate(['/home']);
  }
   
  
}
