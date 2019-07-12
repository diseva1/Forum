import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { global } from './global';

@Injectable()
export class UserService{
    public url: string;
    public identity;
    public token;

    constructor(private _http: HttpClient){
        this.url = global.url;
    }

    register(user): Observable<any>{
        //Transform user object into json string
        let params = JSON.stringify(user);

        //Define headers
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        //Ajax request
        return this._http.post(this.url+'register', params, {headers: headers});
    }

    login(user, getToken = null): Observable<any>{
        //Check if gettoken arrives
        
        if(getToken != null){
            user.getToken = getToken;
        }
        //Transform user object into json string
        let params = JSON.stringify(user);

        //Define headers
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        //Ajax request
        return this._http.post(this.url+'login', params, {headers: headers});
    }

    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity'));

        if(identity && identity != null && identity != undefined && identity != 'undefined' ){
            this.identity = identity;
        }else{
            this.identity = null;
        }

        return this.identity;

    }

    getToken(){
        let token = localStorage.getItem('token');

        if(token && token != null && token != undefined && token != 'undefined' ){
            this.token = token;
        }else{
            this.token = null;
        }

        return this.token;
    }

    update(user):Observable<any>{

        let params = JSON.stringify(user);

        //Define headers
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());

        //Ajax request
        return this._http.put(this.url+'user/update', params, {headers: headers});
    }
}