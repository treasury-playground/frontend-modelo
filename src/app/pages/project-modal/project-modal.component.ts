import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-modal.component.html',
  styleUrls: ['./project-modal.component.css'],
})
export class ProjectModalComponent {
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  maxChars = 200;

  uploadedFiles: {
    file: File;
    status: 'ready' | 'canceled' | 'error';
  }[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      coordinator: ['', Validators.required],
      students: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(this.maxChars)]],
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
  
    const mappedFiles = newFiles.map((file, index) => {
      return {
        file,
        status: statusCycle[(this.uploadedFiles.length + index) % statusCycle.length] as 'ready' | 'canceled' | 'error',
      };
    });
  
    this.uploadedFiles = [...this.uploadedFiles, ...mappedFiles];
  }
  

  removeFile(index: number) {
    this.uploadedFiles.splice(index, 1);
  }

  retryFile(index: number) {
    this.uploadedFiles[index].status = 'ready'; 
  }

  onSave() {
    if (this.form.invalid) return;

    const projectData = {
      ...this.form.value,
      files: this.uploadedFiles,
    };

    console.log('Projeto salvo:', projectData);
    this.close.emit();
  }
}
