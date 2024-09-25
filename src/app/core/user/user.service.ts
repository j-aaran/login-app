import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { User } from './user.types';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * Se crea un ReplaySubject con un buffer de 1 para que
   * una vez iniciada sesión se tenga acceso al usuario
   * logeado. Igualmente con posibilidad de multicasting
   * se tiene acceso de varias partes de la app a esta propiedad
   * mediante los accessors más abajo.
   */
  private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

  // --------------------------------------------------------
  // @ Accessors
  // --------------------------------------------------------


  // Fijar un nuevo usuario en el Subject _user
  set user(value: User) {
    this._user.next(value);
  }

  // Devolver el último valor en el Subject _user
  get user$(): Observable<User> {
    return this._user.asObservable();
  }
}
