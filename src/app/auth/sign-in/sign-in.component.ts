import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    NgIf,
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent {

  signInForm: FormGroup;
  alert: string;
  showAlert: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Crear el formulario
    // En este caso de un solo campo: Número de identificación
    this.signInForm = this._formBuilder.group({
      idNumber: ['', Validators.required]
    })
  }

  // ----------------------------------------------------------------
  // @ Métodos públicos
  // ----------------------------------------------------------------

  signIn(): void {

    // Si el formulario es inválido, si no se ha ingresado 
    // ningún valor no hacer nada
    if (this.signInForm.invalid) {
      return
    }

    // Desactivar el formulario para evitar que se cambie su 
    // valor durante la ejecución de este método 
    this.signInForm.disable()

    // Hacer login por medio del AuthService o Servicio de
    // Autenticación. Este método recibe como parámetros
    // los campos del formulario (el número de identificación
    // ingresado)
    this._authService.signIn(this.signInForm.value).subscribe(
      (response) => {

        // La íltima accion será redireccionar al dashboard 
        // en caso de haberse confirmado el número de identificación
        // y haber logeado correctamente
        this._router.navigateByUrl('/home');


      },
      () => {

        // Rehabilitar el form
        this.signInForm.enable()

        // Reiniciar el form
        this.signInForm.reset()

        // Mostrar la alerta
        this.alert = 'Usuario no encontrado. ¿Está ingresando un número de identificación correcto?'
        this.showAlert = true
      } 
    )
  }
}
