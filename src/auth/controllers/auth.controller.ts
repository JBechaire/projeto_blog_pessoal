import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsuarioResponse } from '../interfaces/usuario-response.interface';
import { LocalAuthGuard } from '../guard/local-auth.guard';
import { UsuarioLogin } from '../entities/usuariologin.entities';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Usuario')
@Controller('/usuarios')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logar')
  login(@Body() usuario: UsuarioLogin): Promise<UsuarioResponse> {
    return this.authService.login(usuario);
  }
}