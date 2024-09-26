import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/user/user.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [ FormsModule, NgIf, ReactiveFormsModule ],
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.css']
})
export class NewPasswordComponent {

  newPasswordForm: FormGroup;
  alert: string;
  showAlert: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {

    // Crear el formulario
    // En caso de registro se sugiere ingresar
    // la nueva contraseña por el usuario
    this.newPasswordForm = this._formBuilder.group({
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    })
  }

  // ----------------------------------------------------------------
  // @ Métodos públicos
  // ----------------------------------------------------------------

  saveNewPassword(): void {

    // Si el formulario es inválido, si no se ha ingresado 
    // ningún valor no hacer nada
    if (this.newPasswordForm.invalid) {
      return
    }


    // Desactivar el formulario para evitar que se cambie su 
    // valor durante la ejecución de este método 
    this.newPasswordForm.disable()

    // Hacer el registro por medio del AuthService o Servicio de
    // Autenticación. Este método recibe como parámetros
    // los campos del formulario (datos del usuario)
    this._authService.saveNewPassword(this.newPasswordForm.value).subscribe(
      (response) => {

        // La íltima accion será redireccionar al dashboard 
        // en caso de haberse confirmado el número de identificación
        // y haber logeado correctamente
        this._router.navigateByUrl('/home');


      },
      (error) => {

        // Rehabilitar el form
        this.newPasswordForm.enable()

        // Reiniciar el form
        this.newPasswordForm.reset()

        // Mostrar la alertas
        this.alert = 'Las contraseñas deben coincidir.'
        this.showAlert = true
      } 
    )
  }

}
