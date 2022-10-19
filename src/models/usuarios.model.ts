import {Entity, hasMany, hasOne, Model, model, property} from '@loopback/repository';
import { PreferenciasUsuario } from './preferencias-usuario.model';
import { Recordatorio } from './recordatorio.model';

@model({settings: {strict: false}})
export class Usuarios extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  CorreoElectronico: string;

  @property({
    type: 'string',
    required: true,
  })
  NombreUsuario: string;

  @property({
    type: 'string',
    required: true,
  })
  Contrasena: string;

  @hasOne(()=> PreferenciasUsuario)
  preferencias:PreferenciasUsuario

  @hasMany(()=>Recordatorio)
  recordatorio:Recordatorio[]

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Usuarios>) {
    super(data);
  }
}

export interface UsuariosRelations {
  // describe navigational properties here
}

export type UsuariosWithRelations = Usuarios & UsuariosRelations;
