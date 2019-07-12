import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { global } from '../../services/global';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [UserService]
})
export class UserEditComponent implements OnInit {
  public pageTitle: string;
  public user: User;
  public identity;
  public token;
  public status;
  public afuConfig;
  public url;

  constructor(
    private _userService: UserService,
    private _router: Router,
    private _route: ActivatedRoute
  ) { 
    this.pageTitle = 'Ajustes de usuario';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getIdentity();
    this.user  = this.identity;
    this.url = global.url;

    this.afuConfig = {
      multiple:false,
      formatsAllowed: ".jpg, .jpeg, .png, .gif",
      maxSize: "50",
      uploadAPI: {
        url: this.url+"upload-avatar",
        headers: {
          "Authorization": this.token
        }
      },
      theme: "attachPin",
      hideProgressBar: false,
      hideResetBtn: true,
      hideSelectBtn: false,
      attachPinText: 'Sube tu foto',
      replaceTexts: {
        attachPinBtn: 'Seleccionar Foto'
      }

    };
  }
  avatarUpload(data){
    let data_obj = JSON.parse(data.response);
    this.user.image = data_obj.user.image;

  }

  ngOnInit() {
  }

  onSubmit(){
    this._userService.update(this.user).subscribe(
      response => {
        if(!response.user){
          this.status = 'error';
        }else{
          this.status = 'success';
          localStorage.setItem('identity', JSON.stringify(this.user));
        }
        
      },
      error =>{
        this.status = 'error';
        console.log(error);
      }
    );
  }

}
