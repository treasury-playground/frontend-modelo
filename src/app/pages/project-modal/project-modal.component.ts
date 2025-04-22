import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule],
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css']
})
export class ProjectModalComponent implements OnInit {
  @Input() isEditMode: boolean = false;
  @Input() projectToEdit: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  submitted = false;
  form: FormGroup;
  maxChars = 200;

  uploadedFiles: {
    file: File;
    status: 'ready' | 'canceled' | 'error';
  }[] = [];

  availableStudents: string[] = ['Davi Gomes', 'Elli Morais', 'Eloquinn Teixeira', 'Beatriz Silva'];
  roles: string[] = ['Trainee', 'Junior', 'Senior', 'Master'];

  selectedStudent: string = '';
  selectedRole: string = '';

  assignedStudents: { name: string; role: string }[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      coordinator: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(this.maxChars)]]
    });
  }

  ngOnInit(): void {
    if (this.isEditMode && this.projectToEdit) {
      this.form.patchValue({
        name: this.projectToEdit.name,
        coordinator: this.projectToEdit.coordinator,
        description: this.projectToEdit.description
      });

      this.assignedStudents = this.projectToEdit.assignedStudents || [];
      this.uploadedFiles = this.projectToEdit.files || [];
    }
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
      status: statusCycle[(this.uploadedFiles.length + index) % statusCycle.length] as 'ready' | 'canceled' | 'error'
    }));

    this.uploadedFiles = [...this.uploadedFiles, ...mappedFiles];
  }

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }

  retryFile(index: number) {
    this.uploadedFiles[index].status = 'ready';
  }

  assignStudentWithRole() {
    if (!this.selectedStudent || !this.selectedRole) return;

    const alreadyAssignedIndex = this.assignedStudents.findIndex(s => s.name === this.selectedStudent);
    if (alreadyAssignedIndex !== -1) {
      this.assignedStudents[alreadyAssignedIndex].role = this.selectedRole;
    } else {
      this.assignedStudents.push({ name: this.selectedStudent, role: this.selectedRole });
    }

    this.selectedStudent = '';
    this.selectedRole = '';
  }

  removeAssignedStudent(name: string) {
    this.assignedStudents = this.assignedStudents.filter(s => s.name !== name);
  }

  onSave() {
    this.submitted = true;

    if (this.form.invalid || this.assignedStudents.length === 0) {
      alert('Fill all required fields and assign at least one student.');
      return;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US');

    const projectData = {
      ...this.form.value,
      assignedStudents: this.assignedStudents,
      files: this.uploadedFiles,
      date: formattedDate,
      id: this.projectToEdit?.id || Date.now()
    };

    this.save.emit(projectData);
    this.close.emit();
  }
}
