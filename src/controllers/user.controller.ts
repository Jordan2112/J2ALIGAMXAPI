import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserCredentials,
  UserRepository,
  UserServiceBindings,
}from '@loopback/authentication-jwt'
import {inject} from '@loopback/core';
import {model, property, repository,Filter,FilterExcludingWhere} from '@loopback/repository'
import {
  post,
  param,
  get,
  put,
  del,
  getModelSchemaRef,
  requestBody,
  response,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security'
import{genSalt, hash} from 'bcryptjs'
import _ from 'lodash'
import { TokenService } from '@loopback/authentication';
import { authenticate } from '@loopback/authentication/dist/decorators';

@model()
export class NewUserRequest extends User{
  @property({
    type:'string',
    required:true,
  })
  password: string
}

const CredentialSchema: SchemaObject = {
  type: 'object',
  required: ['email','password'],
  properties: {
    email: {
      type:'string',
      format:'email',
    },
    password:{
      type:'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'Función de entrada de inicio de sesión',
  required: true,
  content:{
    'application/json':{schema:CredentialSchema},
  },
};

export class UserController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER,{optional:true})
    public user:UserProfile,
    @repository(UserRepository) protected userRepository:UserRepository,
  ){}

  //Inicio de sesión para un usuario
  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    return currentUserProfile[securityId];
  }

  //Registro para un usuario
  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(NewUserRequest, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return savedUser;
  }

  //Consulta masiva de usuarios
  @authenticate('jwt')
  @get('/users/userstable')
  @response(200, {
    description: 'Array of Usuarios model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  //Consultar usuarios mediante el Id
  @authenticate('jwt')
  @get('/users/{id}')
  @response(200, {
    description: 'Usuarios model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  //Modificar usuario con el modelo users
  @authenticate('jwt')
  @put('/users/{id}')
  @response(204, {
    description: 'Usuarios PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuarios: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, usuarios);
  }

  //Eliminar usuarios mediante el Id
  @authenticate('jwt')
  @del('/users/{id}')
  @response(204, {
    description: 'Usuarios DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  // @authenticate('jwt')
  // @put('/users/{id}')
  // @response(204, {
  //   description: 'Usuarios PUT success',
  // })
  // async replaceById(
  //   @param.path.string('id') id: string,
  //   @requestBody() usuariosCredentials: UserCredentials,
  // ): Promise<void> {
  //   await this.userRepository.replaceById(id, usuariosCredentials);
  // }

}





