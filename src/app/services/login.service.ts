import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { map, of, switchMap, tap } from 'rxjs';
import { StorageUtil } from 'src/utils/storage.utils';
import { StorageKeys } from 'src/enums/storage-keys.enum';
// import { Observable, switchMap, map } from 'rxjs';

const { apiKey, apiUsers } = environment;

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  //Dependency Injection.
  constructor(private readonly http: HttpClient) {}

  // Models, HttpClient, Observables and RxJS operators

  public login(username: string): Observable<User> {
    return this.checkUsername(username).pipe(
      switchMap((user: User | undefined) => {
        if (user === undefined) {
          return this.createUser(username);
        }
        return of(user);
      }),
      tap((user: User) => {
        StorageUtil.storageSave<User>(StorageKeys.User, user);
        // TODO: this should  probably  be done
      })
    );
  }

  //Login
  private checkUsername(username: string): Observable<User | undefined> {
    return (
      this.http
        .get<User[]>(`${apiUsers}?username=${username}`)
        //RxJS Operators
        .pipe(map((response: User[]) => response.pop()))
    );
  }

  //Check if the user exists

  //IF NOT USER - Create a new user
  private createUser(username: string): Observable<User> {
    //user

    const user = {
      username,
      favourites: [],
    };
    //headers -> API Key
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    });

    return this.http.post<User>(apiUsers, user, { headers });
    //POST -> Create items on the server
  }
  //IF NOT USER || Created user -> store user
}
