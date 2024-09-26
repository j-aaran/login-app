import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-confirmation-required',
  standalone: true,
  imports: [ FormsModule, NgIf, ReactiveFormsModule ],
  templateUrl: './confirmation-required.component.html',
  styleUrls: ['./confirmation-required.component.css']
})
export class ConfirmationRequiredComponent implements OnInit{

  codeForm: FormGroup;
  alert: string;
  showAlert: boolean = false;

  // Mostrar temporalmente el código para desarrollo
  verificationCode: string;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Crear el formulario
    // En este caso de un solo campo: Contraseña
    this.codeForm = this._formBuilder.group({
      code: ['', Validators.required]
    })

    this._authService.verificationCode$.subscribe(
      (response) => {
        this.verificationCode = response;
      })
  }

  // ----------------------------------------------------------------
  // @ Métodos públicos
  // ----------------------------------------------------------------

  confirm(): void {

    // Si el formulario es inválido, si no se ha ingresado 
    // ningún valor no hacer nada
    if (this.codeForm.invalid) {
      return
    }

    // Desactivar el formulario para evitar que se cambie su 
    // valor durante la ejecución de este método 
    this.codeForm.disable()

    this._authService.verifyCode(this.codeForm.value).subscribe(
      (response) => {

        // La última accion será redireccionar a cambiar  
        // en caso de haberse confirmado la contraseña
        // y haber desbloqueado correctamente
        this._router.navigateByUrl('/new-password');


      },
      (error) => {

        // Rehabilitar el form
        this.codeForm.enable()

        // Reiniciar el form
        this.codeForm.reset()

        // Mostrar la alertas
        this.alert = 'Código de verificación incorrecto.'
        this.showAlert = true
      } 
    )
  }
}
