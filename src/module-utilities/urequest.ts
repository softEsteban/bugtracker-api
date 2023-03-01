import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class URequest {

    constructor(private http: HttpService) { }

    /**
     * Realiza una petición HTTP dependiendo de los parámetros que entran
     * @param url Url del sevicio solicitado
     * @param type Tipo de la petición (GET, POST, PUT, DELETE)
     * @param data Objeto con los datos esperados por el servicio en caso 
     * de necesitarlos
     * @returns Respuesta del servicio
     */
    async makeRequest(url: string, type: string, data?: any, headers?: any) {
        try {
            let response: any = null;
            //HTTP GET Request
            if (type == "get") {
                response = await lastValueFrom(
                    this.http.get(url, { headers: headers })
                )
            }
            //HTTP POST Request
            else if (type == "post") {
                response = await lastValueFrom(
                    this.http.post(url, data, { headers: headers })
                )
            }
            //HTTP PUT Request
            else if (type == "put") {
                response = await lastValueFrom(
                    this.http.put(url, data, { headers: headers })
                )
            }
            //HTTP DELETE Request
            else if (type == "delete") {
                response = await lastValueFrom(
                    this.http.delete(url, { headers: headers })
                )
            }
            return response.data;
        } catch (error) {
            return "Error: " + error;
        }
    }
}
