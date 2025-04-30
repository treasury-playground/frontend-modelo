export interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    educationalInstitution: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    date: string;
    coordinatorId: string;
    students: Array<{ id: string; role: string }>;
    pdfBase64s: string[];
}

export type CreateProjectDto = Omit<Project, 'id'>;