import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    let authData = {
      email: this.email,
      password: this.password,
    };

    this.http
      .post('http://localhost:3000/auth/login', JSON.stringify(authData), {
        headers: headers,
      })
      .subscribe({
        next: (response) => {
          //@ts-ignore
          if (response.status === 200) {
            console.log(response);
            // Handle successful login here
            this.router.navigate(['/dashboard']);
          } else {
            alert('Invalid credentials');
          }
        },
        error: (error) => {
          alert('Error occurred during login: ' + error);
        },
      });
  }
}
