import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { ApiAiClient } from 'api-ai-javascript';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

export class Message {
  constructor(public content: string, public sentBy:string) {}
}

@Injectable()
export class ChatService {

  readonly token = environment.dialogflow.BakaAsur;
  readonly client = new ApiAiClient({ accessToken: this.token });

  conversation = new BehaviorSubject<Message[]>([]);

  constructor() { }

  // add msg to source
  update(msg: Message) {
      this.conversation.next([msg]);
  }

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    return this.client.textRequest(msg)
    .then((res) => {
      const speech = res.result.fulfillment.speech;
      const botMessage = new Message(speech, 'bot');
      this.update(botMessage);
    });
  }

  talk() {
    this.client.textRequest('Who are you!')
    .then((response) => console.log(response));
  }
}
