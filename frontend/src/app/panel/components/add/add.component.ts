import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';

import { Topic } from '../../../models/topic';
import { UserService } from '../../../services/user.service';
import { TopicService } from '../../../services/topic.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [UserService, TopicService]
})
export class AddComponent implements OnInit {
  public pageTitle: string;
  public topic: Topic;
  public identity;
  public token;
  public status;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _topicService: TopicService
  ) { 
    this.pageTitle = 'Crear nuevo tema';
    this.identity = this._userService.getIdentity(); 
    this.token = this._userService.getToken(); 
    this.topic = new Topic('','','','','','',this.identity._id, null);

  }

  ngOnInit() {
  }

  onSubmit(form){
    console.log(this.topic);
  }
}
