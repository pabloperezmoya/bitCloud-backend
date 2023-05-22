import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as crypto from 'crypto';

@Injectable()
export class WebhookGuard implements CanActivate {
  constructor(
    @Inject('CLERK_WEBHOOK_SECRET') private clerkWebhookSecret: string,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const svix_signature = request.headers['svix-signature'];
    const svix_id = request.headers['svix-id'];
    const svix_timestamp = request.headers['svix-timestamp'];
    const body = request.rawBody;

    const signedContent = `${svix_id}.${svix_timestamp}.${body}`;
    const secret = this.clerkWebhookSecret;

    // Need to base64 decode the secret
    const secretBytes = Buffer.from(secret.split('_')[1], 'base64');
    const signature = 'v1,'.concat(
      crypto
        .createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64'),
    );

    if (signature !== svix_signature) {
      return false;
    }
    return true;
  }
}
