import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserRequestDto } from './create-user-request.dto';
import { CreateUserEvent } from './create-user.event';

@Injectable()
export class AppService {

  private readonly users: CreateUserRequestDto[] = [];

  constructor(
    @Inject('COMMUNICATION') private readonly communiationClient: ClientProxy,
    @Inject('ANALYTICS') private readonly analyticsClient: ClientProxy
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  createUser(createUserRequest: CreateUserRequestDto) {
    this.users.push(createUserRequest);
    console.log('User created: ', createUserRequest);

    this.communiationClient.emit('user_created', new CreateUserEvent(createUserRequest.email));
    this.analyticsClient.emit('user_created', new CreateUserEvent(createUserRequest.email));
    return new CreateUserEvent(createUserRequest.email);
  }

  getAnalytics() {
    return this.analyticsClient.send({cmd: 'get_analytics'}, {});
  }
}
