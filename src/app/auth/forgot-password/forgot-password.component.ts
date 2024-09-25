import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  forgotPassForm: FormGroup;
  alert: string;
  showAlert: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Crear el formulario
    // En este caso de un solo campo: Email
    this.forgotPassForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  // ----------------------------------------------------------------
  // @ Métodos públicos
  // ----------------------------------------------------------------

  sendEmail(): void {

    // Si el formulario es inválido, si no se ha ingresado 
    // ningún valor no hacer nada
    if (this.forgotPassForm.invalid) {
      return
    }

    // Desactivar el formulario para evitar que se cambie su 
    // valor durante la ejecución de este método 
    this.forgotPassForm.disable()

    // Enviar código de verificación por medio del AuthService o 
    // Servicio de Autenticación. Este método recibe como parámetros
    // los campos del formulario (el email del usuario)
    this._authService.sendEmailVerification(this.forgotPassForm.value).subscribe(
      (response) => {
        // La última accion será redireccionar al dashboard 
        // en caso de haberse confirmado el número de identificación
        // y haber logeado correctamente
        this._router.navigateByUrl('/confirmation-required');
      },
      (error) => {

        // Rehabilitar el form
        this.forgotPassForm.enable()

        // Reiniciar el form
        this.forgotPassForm.reset()

        // Mostrar la alertas
        this.alert = 'Su usuario no se halla en nuestros registros.'
        this.showAlert = true
      } 
    )
  }
}
