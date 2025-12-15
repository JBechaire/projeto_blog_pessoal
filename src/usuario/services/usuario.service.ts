import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { Usuario } from '../entities/usuario.entities';
import { Postagem } from '../../postagem/entities/postagem.entity';

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) { }

    //criar
    async create(usuario: Usuario): Promise<Usuario> {
        const buscaUsuario = await this.findByUsuario(usuario.usuario);

        if (buscaUsuario)
            throw new HttpException('O usuário já existe!', HttpStatus.BAD_REQUEST);

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        return await this.usuarioRepository.save(usuario);
    }

    //por usuario
    async findByUsuario(usuario: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({
            where: {
                usuario: usuario,
            },
        });
    }

    //todos
    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
        relations:{
            postagem: true
        }
        })
    }

    //por id 
    async findById(id: number): Promise<Usuario> {
        const usuario = await this.usuarioRepository.findOne({
            where: {
                id,
            },
            relations:{
            postagem: true
        }
        }); 

        if (!usuario)
            throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);

        return usuario;
    }

    //atualizar
    async update(usuario: Usuario): Promise<Usuario> {
        await this.findById(usuario.id);

        const buscaUsuario = await this.findByUsuario(usuario.usuario);

        if (buscaUsuario && buscaUsuario.id !== usuario.id)
            throw new HttpException(
                'Usuário (e-mail) já cadastrado!',
                HttpStatus.BAD_REQUEST,
            );

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        return await this.usuarioRepository.save(usuario);
    }
}