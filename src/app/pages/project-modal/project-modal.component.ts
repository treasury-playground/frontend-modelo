import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent {
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  maxChars = 200;

  uploadedFiles: {
    file: File;
    status: 'ready' | 'canceled' | 'error';
  }[] = [];

  availableStudents: string[] = ['Student 1', 'Student 2', 'Student 3', 'Student 4'];
  availableRoles: string[] = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Master'];

  selectedStudent: string = '';
  selectedRole: string = '';

  assignedStudents: { name: string; role: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      coordinator: ['', Validators.required],
      students: ['', Validators.required], 
      description: ['', [Validators.required, Validators.maxLength(this.maxChars)]]
    });
  }

  get descriptionLength(): number {
    return this.form.get('description')?.value?.length || 0;
  }

  get totalSizeKB(): number {
    return this.uploadedFiles.reduce((acc, item) => acc + item.file.size, 0) / 1024;
  }

  onFileSelected(event: any) {
    const newFiles = Array.from(event.target.files) as File[];
    const statusCycle = ['ready', 'canceled', 'error'];

    const mappedFiles = newFiles.map((file, index) => ({
      file,
      status: statusCycle[(this.uploadedFiles.length + index) % statusCycle.length] as
        | 'ready'
        | 'canceled'
        | 'error'
    }));

    this.uploadedFiles = [...this.uploadedFiles, ...mappedFiles];
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }

  retryFile(index: number) {
    this.uploadedFiles[index].status = 'ready';
  }

  addStudentWithRole() {
    if (this.selectedStudent && this.selectedRole) {
      const alreadyAdded = this.assignedStudents.some(s => s.name === this.selectedStudent);
      if (!alreadyAdded) {
        this.assignedStudents.push({
          name: this.selectedStudent,
          role: this.selectedRole
        });
      }

      this.selectedStudent = '';
      this.selectedRole = '';
    }
  }

  removeAssignedStudent(index: number) {
    this.assignedStudents.splice(index, 1);
  }

  onSave() {
    if (this.form.invalid) return;

    const projectData = {
      ...this.form.value,
      assignedStudents: this.assignedStudents,
      files: this.uploadedFiles
    };

    console.log('Projeto salvo:', projectData);
    this.close.emit();
  }
}
