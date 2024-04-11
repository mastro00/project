import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { User } from "./user.model";


export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    



    constructor(private http: HttpClient) {}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>( //l'api dice che restituisce l'oggetto definito nell'interfaccia sopra, quindi con gli angolari possiamo indicare che tipo di oggetto verrà restituito
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBtF8Kn6F_yuh8QFXH_L8wIQRb0NngAm1s', // La prima parte di link è dove mandare la richiesta(in questo caso all'api che permette di fare il sing in fornita da firebase, la parte dopo "=" è la chiave del nostro db che si prendere dalle impostazioni)
        {   //guardando l'api dice che ha bisogno di email password ed un token sempre vero, quindi gli passiamo quelli
            email: email,
            password: password,
            returnSecureToken: true
        }
        )
        .pipe(
            catchError(this.handleError), 
            tap(resData => {
            this. handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken, 
                +resData.expiresIn
            );
        })
    );
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBtF8Kn6F_yuh8QFXH_L8wIQRb0NngAm1s',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        )
        .pipe(catchError(this.handleError), tap(resData => {
            this. handleAuthentication(
                resData.email, 
                resData.localId, 
                resData.idToken, 
                +resData.expiresIn
            );
        }));
    }

    private handleAuthentication(
        email: string,
        userId: string, 
        token: string, 
        expiresIn: number
    ) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
            const user = new User(
                email, 
                userId, 
                token, 
                expirationDate
            );
            this.user.next(user);
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occured!';
            if(!errorRes.error || !errorRes.error.error) {
                return throwError(errorMessage);
            }
            switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email exists already';
                    break;
                case 'EMAIL_NOT_FOUND':
                    errorMessage = 'This email does not exist.';
                    break;
                case 'INVALID_PASSWORD':
                    errorMessage = 'this password is not correct';
                    break;
                }

                return throwError(errorMessage);
        }
}