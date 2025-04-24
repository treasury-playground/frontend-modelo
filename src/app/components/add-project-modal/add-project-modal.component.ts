import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApiService} from '../../services/api.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { CreateProjectDto, User } from '../../models/models';

@Component({
  selector: 'app-add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.css'],
  imports: [MatOptionModule, MatInputModule, MatIconModule, MatFormFieldModule, MatSelectModule, CommonModule, FormsModule, ReactiveFormsModule]
})

export class AddProjectModalComponent implements OnInit {
  roles = ['Trainee', 'Junior', 'Senior', 'Master'];
  selectedRole: string = '';
  allStudents: User[] = [];
  filteredStudents: User[] = [];
  studentControl = new FormControl<number[]>([]);
  searchInput = new FormControl('');
  selectedFiles: File[] = [];

  selectedStudents: { id: number, role: string }[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadStudents();
  }

  private loadStudents(): void {
    this.apiService.getUsuarios().subscribe({
      next: (users: User[]) => {
        this.allStudents = users.filter(user => user.role === 'student');
        this.filteredStudents = [...this.allStudents];
      },
      error: (err) => console.error('Error loading students:', err)
    });
  }

  public filterStudents(searchTerm: string): void {
    this.filteredStudents = this.allStudents.filter(student =>
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.educationalInstitution?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Remove estudantes adicionados (exibidos como pill) com base no id
  removeStudent(studentId: number): void {
    this.selectedStudents = this.selectedStudents.filter(s => s.id !== studentId);
  }

  // Método para comparar IDs de estudante (usado no mat-select)
  compareStudents(a: number, b: User): boolean {
    return a === b.id;
  }

  // Obtém o nome do estudante para exibir na pill
  getStudentName(id: number): string {
    const student = this.allStudents.find(s => s.id === id);
    return student ? student.fullName : 'Unknown';
  }

  // Adiciona os estudantes com o role selecionado ao array selectedStudents
  addStudent(): void {
    // Verifica se há algum estudante selecionado e se um role foi definido
    const studentIds: number[] = this.studentControl.value || [];
    if (studentIds.length === 0 || !this.selectedRole) {
      return;
    }

    // Para cada estudante selecionado, adiciona ao array se ainda não estiver presente
    studentIds.forEach(id => {
      if (!this.selectedStudents.find(s => s.id === id)) {
        this.selectedStudents.push({ id, role: this.selectedRole });
      }
    });
    // Limpa a seleção do mat-select
    this.studentControl.setValue([]);
  }
  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    this.selectedFiles = Array.from(files);
  }

  removeFile(file: File): void {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    // Garanta que existem dados válidos
    if (!this.data.projectName?.trim()) {
      console.warn('Preencha o nome do projeto');
      return;
    }

    const payload: CreateProjectDto = {
      name: this.data.projectName.trim(),
      description: this.data.description?.trim() || '',
      date: new Date().toISOString().split('T')[0],  // e.g. "2025-04-23"
      coordinatorId: 4,                              // hard-coded
      students: this.selectedStudents                // já é Array<{id:number,role:string}>
    };

    this.apiService.createProject(payload).subscribe({
      next: created => {
        // aqui o `created.id` virá preenchido pelo JSON-Server
        this.dialogRef.close(created);
      },
      error: err => {
        console.error('Erro ao criar projeto', err);
      }
    });
  }
}