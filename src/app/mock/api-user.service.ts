// user.ts
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { User } from "../core/user/user.types";

/**
 * Usuarios ficticios
 */
let users: User[] = [
    { id: '1', name: "Alice", email: "alice@example.com", password: "password123" },
    { id: '2', name: "Bob", email: "bob@example.com", password: "password456" },
    { id: '3', name: "Charlie", email: "charlie@example.com", password: "password789" },
    { id: '4', name: "Diana", email: "diana@example.com", password: "password101" },
    { id: '5', name: "Eve", email: "eve@example.com", password: "password202" },
];

// Simulación de la API
@Injectable({
    providedIn: 'root'
  })
export class UserApi {

    /**
     * El objetivo de este servicio es simular un backend
     * Todos estos métodos en un sistema real serían 
     * accedidos mediante requests http a una API disponible.
     */

    /**
     * Obtener todos los usuarios en el sistema
     * 
     */
    get(): Observable<User[]> {
        return of(users);
    };

    /**
     * Obtener un usuario dado un id para realizar la
     * búsqueda. Si el usuario no se encuentra lanzar
     * un error.
     * 
     */    
    getById(id: string): Observable<User> {
        const user = users.find(user => user.id === id)
        if (!user) {
            return throwError(() => new Error('Usuario no encontrado'))
        }
        return of(user);
    };

    /**
     * Igual que el anterior, obtener un usuario dado 
     * un email para realizar la
     * búsqueda. Si el usuario no se encuentra lanzar
     * un error.
     * 
     */ 
    getByEmail(email: string): Observable<User> {
        const user = users.find(user => user.email === email)
        if (!user) {
            return throwError(() => new Error('Usuario no encontrado'))
        }
        return of(user);
    };

    /**
     * Registrar un nuevo usuario. Si el usuario ya se 
     * encuentra lanzar un error.
     * 
     */
    post(newUser: User): Observable<User> {

        const user = users.find(user => user.email === newUser.email)
        if (user) {
            return throwError(() => new Error('Usuario registrado!'))
        }

        users.push(newUser);
        return of(newUser);
    };

    /**
     * Actualizar un usuario. Usado para actualizar la 
     * contraseña
     * 
     */
    update(updatedUser: User): Observable<User | undefined> {
        const index = users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            return of(updatedUser);
        }
        return of(undefined);
    };

    /**
     * Eliminar un usuario dado un id
     * Este método no se implementa en la app.
     * 
     */
    delete(id: string): Observable<boolean> {
        const index = users.findIndex(user => user.id === id);
        if (index !== -1) {
            users.splice(index, 1);
            return of(true);
        }
        return of(false);
    }
};


