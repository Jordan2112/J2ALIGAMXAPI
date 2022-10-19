import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {PreferenciasUsuario} from '../models';
import {PreferenciasUsuarioRepository} from '../repositories';

export class PreferenciasUsuarioController {
  constructor(
    @repository(PreferenciasUsuarioRepository)
    public preferenciasUsuarioRepository : PreferenciasUsuarioRepository,
  ) {}

  @post('/preferencias-usuarios')
  @response(200, {
    description: 'PreferenciasUsuario model instance',
    content: {'application/json': {schema: getModelSchemaRef(PreferenciasUsuario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PreferenciasUsuario, {
            title: 'NewPreferenciasUsuario',
            exclude: ['Idpreferencias'],
          }),
        },
      },
    })
    preferenciasUsuario: Omit<PreferenciasUsuario, 'Idpreferencias'>,
  ): Promise<PreferenciasUsuario> {
    return this.preferenciasUsuarioRepository.create(preferenciasUsuario);
  }

  @get('/preferencias-usuarios/count')
  @response(200, {
    description: 'PreferenciasUsuario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PreferenciasUsuario) where?: Where<PreferenciasUsuario>,
  ): Promise<Count> {
    return this.preferenciasUsuarioRepository.count(where);
  }

  @get('/preferencias-usuarios')
  @response(200, {
    description: 'Array of PreferenciasUsuario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PreferenciasUsuario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PreferenciasUsuario) filter?: Filter<PreferenciasUsuario>,
  ): Promise<PreferenciasUsuario[]> {
    return this.preferenciasUsuarioRepository.find(filter);
  }

  @patch('/preferencias-usuarios')
  @response(200, {
    description: 'PreferenciasUsuario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PreferenciasUsuario, {partial: true}),
        },
      },
    })
    preferenciasUsuario: PreferenciasUsuario,
    @param.where(PreferenciasUsuario) where?: Where<PreferenciasUsuario>,
  ): Promise<Count> {
    return this.preferenciasUsuarioRepository.updateAll(preferenciasUsuario, where);
  }

  @get('/preferencias-usuarios/{id}')
  @response(200, {
    description: 'PreferenciasUsuario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PreferenciasUsuario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(PreferenciasUsuario, {exclude: 'where'}) filter?: FilterExcludingWhere<PreferenciasUsuario>
  ): Promise<PreferenciasUsuario> {
    return this.preferenciasUsuarioRepository.findById(id, filter);
  }

  @patch('/preferencias-usuarios/{id}')
  @response(204, {
    description: 'PreferenciasUsuario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PreferenciasUsuario, {partial: true}),
        },
      },
    })
    preferenciasUsuario: PreferenciasUsuario,
  ): Promise<void> {
    await this.preferenciasUsuarioRepository.updateById(id, preferenciasUsuario);
  }

  @put('/preferencias-usuarios/{id}')
  @response(204, {
    description: 'PreferenciasUsuario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() preferenciasUsuario: PreferenciasUsuario,
  ): Promise<void> {
    await this.preferenciasUsuarioRepository.replaceById(id, preferenciasUsuario);
  }

  @del('/preferencias-usuarios/{id}')
  @response(204, {
    description: 'PreferenciasUsuario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.preferenciasUsuarioRepository.deleteById(id);
  }
}
