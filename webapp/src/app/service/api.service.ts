import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() { }

  muestraMensaje(mensaje: string) {
    alert(mensaje)
  }
}
