import {belongsTo, Entity, Model, model, property} from '@loopback/repository';
import { Usuarios } from './usuarios.model';

@model({settings: {strict: false}})
export class Recordatorio extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  idrecordatorio?: number;

  @property({
    type: 'number',
    required: true,
  })
  Partido: number;

  @property({
    type: 'number',
    required: true,
  })
  jornada: number;

  @property({
    type: 'date',
    required: true,
  })
  Fecha: string;

  @property({
    type: 'string',
    required: true,
  })
  idrecordatoriousuario: string;

  @belongsTo(()=>Usuarios)
  usuarios : string;
  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Recordatorio>) {
    super(data);
  }
}

export interface RecordatorioRelations {
  // describe navigational properties here
}

export type RecordatorioWithRelations = Recordatorio & RecordatorioRelations;
