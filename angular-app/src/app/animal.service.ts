import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AnimalService {

    constructor(private _http: HttpClient) {
        this.getAnimals();
        this.getAnimal();
    }

    getAnimals() {
        const tempObservable = this._http.get('/animals');
        tempObservable.subscribe((data) => {
            console.log('SERVER RESPONDED WITH STUFF: ', data);
        });
    }
    getAnimal() {
        const tempObservable = this._http.get('/animals/5be456f415b48cb9f854b574/edit');
        tempObservable.subscribe((data) => {
            console.log('SERVER RESPONDED WITH STUFF: ', data);
        });
    }
}
