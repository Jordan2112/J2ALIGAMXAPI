import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {J2AligamxDataSource} from '../datasources';
import {Recordatorio, RecordatorioRelations} from '../models';

export class RecordatorioRepository extends DefaultCrudRepository<
  Recordatorio,
  typeof Recordatorio.prototype.idrecordatorio,
  RecordatorioRelations
> {
  constructor(
    @inject('datasources.j2aligamx') dataSource: J2AligamxDataSource,
  ) {
    super(Recordatorio, dataSource);
  }
}
