import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-unlock-session',
  templateUrl: './unlock-session.component.html',
  styleUrls: ['./unlock-session.component.css']
})
export class UnlockSessionComponent {

  unlockSessionForm: FormGroup;
  alert: string;
  showAlert: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    // Crear el formulario
    // En este caso de un solo campo: Contraseña
    this.unlockSessionForm = this._formBuilder.group({
      password: ['', Validators.required]
    })
  }

  // ----------------------------------------------------------------
  // @ Métodos públicos
  // ----------------------------------------------------------------

  unlock(): void {

    // Si el formulario es inválido, si no se ha ingresado 
    // ningún valor no hacer nada
    if (this.unlockSessionForm.invalid) {
      return
    }

    // Desactivar el formulario para evitar que se cambie su 
    // valor durante la ejecución de este método 
    this.unlockSessionForm.disable()

    this._authService.unlockSession(this.unlockSessionForm.value).subscribe(
      (response) => {

        // La última accion será redireccionar de nuevo al home 
        // en caso de haberse confirmado la contraseña
        this._router.navigateByUrl('/home');


      },
      (error) => {

        // Rehabilitar el form
        this.unlockSessionForm.enable()

        // Reiniciar el form
        this.unlockSessionForm.reset()

        // Mostrar la alerta
        this.alert = 'Contraseña incorrecta!';
        this.showAlert = true;
      } 
    )
  }
}
