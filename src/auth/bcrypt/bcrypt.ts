import { hash } from 'bcrypt';
import { Injectable} from '@nestjs/common';

@Injectable()
export class Bcrypt {
  async cryptgrafarSenha(password: string): Promise<string> {
    const saltRounds = 10;
    return await hash(password, saltRounds);
    }

   async verificarSenha(
    password: string, 
    PasswordBanco: string): Promise<boolean> { 
      return await hash(password, PasswordBanco) === PasswordBanco;
    }

}

