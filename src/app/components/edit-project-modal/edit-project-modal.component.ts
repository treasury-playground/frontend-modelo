import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Project, User } from '../../models/models';
import { ApiService } from '../../services/api.service';
import { ProjectsService } from '../../services/projects.service';

@Component({
  selector: 'app-edit-project-modal',
  templateUrl: './edit-project-modal.component.html',
  styleUrls: ['../add-project-modal/add-project-modal.component.css'],
  standalone: true,
  imports: [MatOptionModule, MatInputModule, MatIconModule, MatFormFieldModule, MatSelectModule, CommonModule, FormsModule, ReactiveFormsModule]
})

export class EditProjectModalComponent implements OnInit {
  roles = ['Trainee', 'Junior', 'Senior', 'Master'];

  // CONTROLS (agora números)
  projectName = '';
  description = '';
  date = '';
  coordinatorControl = new FormControl<string>('');
  studentControl = new FormControl<string[]>([]);
  selectedRole = '';

  // LISTAS
  allUsers: User[] = [];
  allStudents: User[] = [];
  allTeachers: User[] = [];
  selectedStudents: { id: string; role: string }[] = [];
  selectedFiles: File[] = [];
  /** Base64s já existentes vindos de this.data */
  existingPdfBase64s: string[] = [];
  /** Base64s que o usuário adicionou nesta sessão de edição */
  newPdfBase64s: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditProjectModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Project,
    private apiService: ApiService,
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    this.apiService.getUsuarios().subscribe(users => {
      // Normaliza IDs para number
      this.allUsers = users;
      this.allStudents = this.allUsers.filter(u => u.role === 'student');
      this.allTeachers = this.allUsers.filter(u => u.role === 'teacher');

      // Pré-popula
      this.projectName = this.data.name;
      this.description = this.data.description;
      this.date = this.data.date;
      this.coordinatorControl.setValue(this.data.coordinatorId);
      this.selectedStudents = this.data.students.map(s => ({ id: s.id, role: s.role }));
      this.studentControl.setValue(this.selectedStudents.map(s => s.id));
      this.existingPdfBase64s = Array.isArray(this.data.pdfBase64s)
        ? [...this.data.pdfBase64s]
        : [];
    });
  }

  compareStudents(a: string, b: User): boolean {
    return a === b.id;
  }

  getUserName(id: string): string {
    const u = this.allUsers.find(u => u.id === id);
    return u ? u.fullName : 'Unknown';
  }

  addStudent(): void {
    const ids = this.studentControl.value || [];
    if (!ids.length || !this.selectedRole) return;
    ids.forEach(id => {
      if (!this.selectedStudents.find(s => s.id === id))
        this.selectedStudents.push({ id, role: this.selectedRole });
    });
    this.studentControl.setValue([]);
  }

  /** Remove student pill */
  removeStudent(id: string): void {
    this.selectedStudents = this.selectedStudents.filter(s => s.id !== id);
    this.studentControl.setValue(this.selectedStudents.map(s => s.id));
  }

  /** Upload files */
  /** dispara ao selecionar no <input type="file" multiple> */
  onFileSelected(evt: Event): void {
    const files = (evt.target as HTMLInputElement).files;
    if (!files?.length) return;

    Array.from(files).forEach(file => {
      // 1) guarda pra exibir a pill e possibilitar remoção
      this.selectedFiles.push(file);

      // 2) converte pra base64 e guarda em newPdfBase64s
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        this.newPdfBase64s.push(dataUrl.split(',')[1]);
      };
      reader.readAsDataURL(file);
    });
  }

  removeExistingFile(index: number): void {
    this.existingPdfBase64s.splice(index, 1);
  }

  /** remove um arquivo recém-carregado (antes de salvar) */
  removeFile(file: File): void {
    // remove do array de File
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);

    // também remove do array de novos base64, pela mesma ordem
    // aqui assumimos que o índice em newPdfBase64s corresponde à ordem de selectedFiles
    // para robustez você poderia manter um objeto { file, base64 } em vez de dois arrays
    this.newPdfBase64s = this.newPdfBase64s.slice(0, this.selectedFiles.length);
  }

  onCancel(): void { this.dialogRef.close(); }

  onSave(): void {
    const updated: Project = {
      id: this.data.id,
      name: this.projectName.trim(),
      description: this.description.trim(),
      date: this.date,
      coordinatorId: this.coordinatorControl.value!,
      students: this.selectedStudents,

      // 3) concatena antigos + novos PDFs
      pdfBase64s: [
        ...this.existingPdfBase64s,
        ...this.newPdfBase64s
      ]
    };

    this.dialogRef.close(updated);
  }

}
