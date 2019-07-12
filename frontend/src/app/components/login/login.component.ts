import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public pageTitle: string;
  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
    ){
      this.pageTitle  = "Identifícate";
      this.user = new User('','','','','','','ROLE_USER');
   }

  ngOnInit() {
  }

  onSubmit(form){
    //Get user complete object
    this._userService.login(this.user).subscribe(
      response =>{
        if(response.user && response.user._id){
          //Save user in a property
          this.identity = response.user;
          localStorage.setItem('identity', JSON.stringify(this.identity));

          //Get user token
          this._userService.login(this.user, true).subscribe(
            response =>{
              if(response.token){
               //Save user token in a property
                this.token = response.token;
                localStorage.setItem('token', this.token);

                this.status = 'success';
                this._router.navigate(['/']);

              }else{
                this.status = 'error';

              }
            },
            error =>{
              this.status = 'error';
              console.log(error);
            }
          );
        }else{
          this.status = 'error';
        }

      },
      error =>{
        this.status = 'error';
        console.log(error);
      }
    );
  }

}
