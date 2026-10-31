import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  courses: any[] = [];
  registrations: any[] = [];

  studentName = '';
  email = '';
  selectedCourse = '';

  message = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCourses();
    this.loadRegistrations();
  }

  loadCourses() {
    this.http.get<any[]>('http://localhost:5000/courses')
      .subscribe(data => this.courses = data);
  }

  loadRegistrations() {
    this.http.get<any[]>('http://localhost:5000/registrations')
      .subscribe(data => this.registrations = data);
  }

  registerCourse() {
    if (!this.studentName.trim() || !this.email.trim() || !this.selectedCourse) {
      this.message = 'Please fill all fields!';
      return;
    }

    const registration = {
      studentName: this.studentName,
      email: this.email,
      courseId: this.selectedCourse
    };

    this.http.post('http://localhost:5000/register', registration)
      .subscribe(() => {
        this.message = 'Course registered successfully!';
        this.studentName = '';
        this.email = '';
        this.selectedCourse = '';
        this.loadRegistrations();
      });
  }

  cancelRegistration(id: string) {
    this.http.delete(`http://localhost:5000/register/${id}`)
      .subscribe(() => {
        this.message = 'Registration cancelled successfully!';
        this.loadRegistrations();
      });
  }
}