import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { ProjectModalComponent } from "../project-modal/project-modal.component";

@Component({
  selector: 'app-project-listing',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ProjectModalComponent],
  templateUrl: './project-listing.component.html',
  styleUrls: ['./project-listing.component.css']
})
export class ProjectListingComponent {
  searchControl = new FormControl('');
  currentPage = 1;
  pageSize = 2;
  showModal = false;


  allProjects = [
    {
      name: 'Project 1',
      description: 'Lorem ipsum dolor sit amet...',
      date: '03/24/2024',
      coordinator: 'Luis Tiago',
      students: ['dev.cerros', 'salmonads']
    },
    {
      name: 'Project 2',
      description: 'Lorem ipsum dolor sit amet...',
      date: '03/24/2024',
      coordinator: 'Luis Tiago',
      students: ['dev.penna', 'salmonads']
    },
    {
      name: 'Project 3',
      description: 'Lorem ipsum dolor sit amet...',
      date: '03/24/2024',
      coordinator: 'Luis Tiago',
      students: ['dev.campos', 'salmonads']
    },
    {
      name: 'Project 4',
      description: 'Lorem ipsum dolor sit amet...',
      date: '03/24/2024',
      coordinator: 'Luis Tiago',
      students: ['dev.junior', 'salmonads']
    }
  ];

  get filteredProjects() {
    const term = this.searchControl.value?.toLowerCase() || '';
    return this.allProjects.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

  get paginatedProjects() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProjects.slice(start, start + this.pageSize);
  }

  totalPages(): number {
    return Math.ceil(this.filteredProjects.length / this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }



openModal() {
  this.showModal = true;
}

closeModal() {
  this.showModal = false;
}

}
