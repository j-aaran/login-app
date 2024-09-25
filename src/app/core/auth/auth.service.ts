import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, Observer, of, ReplaySubject, switchMap, tap, throwError } from 'rxjs';
import { UserApi } from '../../mock/api-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Se crea ReplaySubject con un buffer de 1. 
   * Con posibilidad de multicasting a los cuales se 
   * tendrá acceso de varias partes de la app mediante 
   * los accessors más abajo.
   */
  private _authenticated: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
  private _verificationCode: ReplaySubject<string> = new ReplaySubject<string>(1);

  /**
   * Inyectar el UserService para guardar los datos
   * del usuario logeado al igual que obtener esos datos
   * 
   * Inyectar el UserApi para simular la presencia de 
   * una API real.
   */
  private _userService = inject(UserService);
  private mockApi = inject(UserApi);

  // --------------------------------------------------------
  // @ Accessors
  // --------------------------------------------------------

  /**
   * Guardar el codigo de verificación temporalmente
   * (Solo para modo de desarrollo), en una app real
   * estos dos accessors verificationCode desaparecerían 
   * pues el código se tendría vía email 
   */
  set verificationCode(value: string) {
    this._verificationCode.next(value);
  }

  get verificationCode$(): Observable<string> {
    return this._verificationCode.asObservable();
  }

  /**
   * Fijar si el usuario está autenticado o no en un Subject.
   */
  set isAuthenticated(value: boolean) {
    this._authenticated.next(value);
  }

  /**
   * Observable para saber si el usuario está autenticado o no.
   */
  get isAuthenticated$(): Observable<boolean> {
    return this._authenticated.asObservable();
  }
  

  // -------------------------------------------------------------
  //  @ Métodos públicos
  // -------------------------------------------------------------


  // @ Registro
  // --------------------------------------------------------
  signUp(credentials: {name: string, email: string, password: string, password_confirmation: string}): Observable<any>  {

    // Si las contraseñas no coinciden lanzar un error
    if (credentials.password != credentials.password_confirmation) {
      return throwError(() => new Error('Las contraseñas deben coincider!'))
    }
    // Crear un id aleatorio para asignar al usuario que será registrado
    const id = Math.floor(100000 + Math.random() * 900000).toString(); // Generar un código de 6 dígitos
    
    // Crear un nuevo usuario a partir de las credenciales
    const newUser = {
      id: id,
      name: credentials.name,
      email: credentials.email,
      password: credentials.password
    }
    
    /**
     * Enviar el usuario al backend. El usuario registrado 
     * se obtiene de vuelta en la respuesta. Si el usuario
     * ya está registrado, lanzar un error. No hacer nada.
     */
    return this.mockApi.post(newUser).pipe(
      switchMap((response: any) => {

        // Usuario registrado exitosamente
        return of(response)
      }),
      catchError((error) => {
        console.log('Registrer error: ', error);
        return throwError(() => new Error('El usuario ya está registrado!'));
      })
    )

  }

  // @ Inicio de sesión
  // --------------------------------------------------------
  signIn(credentials: {idNumber: string}): Observable<any> {
    
    /**
     * Buscar el idNumber ingresado en el backend
     * Si el id se encuentra:
     * 1- Guardar los datos del usuario queriendo iniciar 
     * sesión en el UserService
     * 2- Setear la bandera de autenticación a true 
     * y devovler true. 
     * 
     * Si el id no se encuentra lanzar un error. No hacer nada.
     */
    return this.mockApi.getById(credentials.idNumber).pipe(
      switchMap((response: any) => {

        this._userService.user = response;
        // this._userService.user$.subscribe({
        //   next: value => {
        //     console.log(value)
        //   },
        // })

        this.isAuthenticated = true;

        return of(true)
      }),
      catchError((error) => {
        console.log('Authentication error: ', error);
        return throwError(() => new Error('Usuario no encontrado'));
      })
    )
  }

  // @ Enviar email con código de verificación para contraseña 
  //   olvidada
  // --------------------------------------------------------
  sendEmailVerification(credentials: {email: string}): Observable<any> {

    /**
     * Buscar el email ingresado en el backend
     * Si el email se encuentra, enviarle un código
     * de verificación.
     * Si el email no se halla lanzar un error. No hacer
     * nada.
     */
    return this.mockApi.getByEmail(credentials.email).pipe(
      switchMap((response) => {

        this._userService.user = response;
        // this._userService.user$.subscribe({
        //   next: value => {
        //     console.log(value)
        //   },
        // })

        // En el backend se generara un código random 
        // el cual se enviará como respuesta para que 
        // se valide la veracidad de usuario registrado
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generar un código de 6 dígitos
        this.verificationCode = code;
        // Si está conectado a Internet descomentar este código
        // para recibir email de recuperación de contraseña
        // con el código generado
        // await this.mailService.sendMail({
        //   to: email,
        //   subject: 'Código de recuperación de contraseña',
        //   text: `Tu código es: ${code}`
        // })
        return of(true)
      }),
      catchError((error) => {
        console.log('Registrer error: ', error);
        return throwError(() => new Error('Usuario no registrado.'));
      })
    )
  }


  // @ Confirmación de código de recuperación 
  // --------------------------------------------------------
  verifyCode(credentials: { code: string }): Observable<any> {
    
    /**
     * Si el código de verificación ingresado
     * coincide con el enviado al email
     * permitir continuar con el flujo de recuperación
     * Si no coinciden, lanzar un error. No hacer nada.
     */
    return new Observable(observer => {
      this._verificationCode.subscribe(value => {
        if (value === credentials.code) {
          observer.next(true)
          observer.complete()
        } else {
          observer.error(throwError(() => new Error('Código de verificación incorrecto'))) 
        }
      })
    })
  }


  // @ Cerrar Sesión
  // --------------------------------------------------------
  signOut() {
    /** Setear la bandera de autenticado a falso */
    this.isAuthenticated = false;
  }



  // @ Desbloquear sesión
  // --------------------------------------------------------
  unlockSession(credentials: { password: string }): Observable<any> {
    
    // Para desbloquear la sesión accedemos al usuario registrado
    // Si la contraseña ingresada en el formulario de desbloqueo
    // coincido con la del usuario registrado permitir el unlock
    // En caso contrario lanzar un error. No hacer nada.
    return new Observable(observer => {
      this._userService.user$.subscribe(
        currentUser => {
          if(currentUser.password == credentials.password){
            observer.next(true)
            observer.complete()
          } else {
            observer.error(throwError(() => new Error('Contraseña inválida.')))
          }
      })
    })
    
  }


  // @ Guardar la nueva contraseña
  // --------------------------------------------------------
  saveNewPassword(credentials: { password: string, password_confirmation: string }): Observable<any> {
    
    // Si las contraseñas no coinciden lanzar un error
    if (credentials.password == credentials.password_confirmation) {
      
      // Setear la bandera de autenticación
      // Permitido el inicio de sesión
      this.isAuthenticated = true;

      return of(true)

    } else {
      // Si las contraseñas no coinciden lanzar un error. 
      // No hacer nada.
      return throwError(() => new Error('Las contraseñas deben coincidir!'))
    }
  }

}