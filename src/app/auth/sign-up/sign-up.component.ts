import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

  signUpForm: FormGroup;
  alert = {
    message: '',
    status: ''
  };
  showForm: boolean = true;
  showAlert: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {

    // Crear el formulario
    // En caso de registro se sugieren más datos del usuario
    this.signUpForm = this._formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    })
  }

  // ----------------------------------------------------------------
  // @ Métodos públicos
  // ----------------------------------------------------------------

  signUp(): void {

    // Si el formulario es inválido, si no se ha ingresado 
    // ningún valor no hacer nada
    if (this.signUpForm.invalid) {
      return
    }

    // Desactivar el formulario para evitar que se cambie su 
    // valor durante la ejecución de este método 
    this.signUpForm.disable()

    // Hacer el registro por medio del AuthService o Servicio de
    // Autenticación. Este método recibe como parámetros
    // los campos del formulario (datos del usuario)
    this._authService.signUp(this.signUpForm.value).subscribe(
      (response) => {
        // La última accion será redireccionar al sign-in 
        // en caso de haberse confirmado registro
        // para hacer login por primera vez
        // Rehabilitar el form
        this.signUpForm.enable()

        // Reiniciar el form
        this.signUpForm.reset()

        // Mostrar la alerta
        this.alert = {
          message: `[Email] Su número de id en registro es ${response.id}. Puede usarlo para iniciar sesión en nuestro sistema.`,
          status: 'success',
        }

        this.showAlert = true;
        this.showForm = false;

      },
      (error) => {

        // Rehabilitar el form
        this.signUpForm.enable()

        // Reiniciar el form
        this.signUpForm.reset()

        // Mostrar la alerta
        this.alert = {
          message: error,
          status: 'error',
        }
        this.showAlert = true;
      } 
    )
  }
  
}
