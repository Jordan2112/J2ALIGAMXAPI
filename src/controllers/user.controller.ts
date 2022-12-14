import {
  authenticate,
  TokenService,
  UserService
} from '@loopback/authentication';
import {Credentials, RefreshTokenService, RefreshTokenServiceBindings, TokenObject, TokenServiceBindings, User, UserCredentialsRepository, UserRepository, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {model, property} from '@loopback/repository';
import {get, HttpErrors, param, post, requestBody, SchemaObject} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import {enlaceConfirm, enlacePassword} from '../enlaces';
import {MailServiceBindings} from '../key';
import {EmailService} from '../services';

// Describes the type of grant object taken in by method "refresh"
type RefreshGrant = {

  refreshToken: string

};

// Describes the schema of grant object
const RefreshGrantSchema: SchemaObject = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
    },
  },
};

// Describes the request body of grant object
const RefreshGrantRequestBody = {
  description: 'Reissuing Acess Token',
  required: true,
  content: {
    'application/json': {schema: RefreshGrantSchema},
  },
};

// Describe the schema of user credentials
const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

const PasswordSchema: SchemaObject = {
  type: 'object',
  required: ['password'],
  properties: {
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

@model()
export class NewUserRequest extends User {
  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

@model()
export class NewUserRequestPassword {
  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  token: string;
}

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class UserController {
  constructor(

    @inject(MailServiceBindings.MAILER_SERVICE)
    public EmailService: EmailService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: UserService<User, Credentials>,
    @inject(UserServiceBindings.USER_CREDENTIALS_REPOSITORY)
    public userCredentials: UserCredentialsRepository,
    @inject(SecurityBindings.USER, {optional: true})
    private user: UserProfile,
    @inject(UserServiceBindings.USER_REPOSITORY)
    public userRepository: UserRepository,
    @inject(RefreshTokenServiceBindings.REFRESH_TOKEN_SERVICE)
    public refreshService: RefreshTokenService,
  ) { }

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User model instance',
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
          schema: CredentialsSchema,
        },
      },
    })
    newUserRequest: NewUserRequest,
  ): Promise<User> {

    const password = await hash(newUserRequest.password, await genSalt());
    delete (newUserRequest as Partial<NewUserRequest>).password;
    const user = await this.userRepository.create(newUserRequest);

    await this.userRepository.userCredentials(user.id).create({password});

    const userProfile = this.userService.convertToUserProfile(user);
    const token = await this.jwtService.generateToken(userProfile);

    await this.userRepository.updateById(user.id, {verificationToken: token});
    await this.EmailService.sendMail({

      to: newUserRequest.email,
      //Metodo que regresa el enlace para confirmar el correo
      html: enlaceConfirm(user.username, token),
      subject: "Correo de registro",

    });

    return user;
  }

  @get('/user/{email}', {
    responses: {
      '200': {
        description: 'email exist',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async findByEmail(
    @param.path.string('email') email: string,
  ): Promise<User | null> {
    if (!email) {
      throw new HttpErrors.BadRequest('email format not valid');
    }
    var user = await this.userRepository.findOne({where: {email: email}})
    if (user) {
      const userProfile = this.userService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      await this.userRepository.updateById(user.id, {verificationToken: token});
      await this.EmailService.sendMail({
        to: user.email,
        //Metodo que regresa el enlace para recuperar contrase??a
        html: enlacePassword(user.username, token),
        subject: "Recupera tu contrase??a",
      })
      return user;
    } else {
      throw new HttpErrors.BadRequest('email format not valid');
    }
  }

  @post('/changePass/{token}', {
    responses: {
      '200': {
        description: 'Verification Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async changepass(
    @param.path.string('token') token: string,
    @requestBody({
      content: {
        'application/json': {
          schema: PasswordSchema,
        },
      },
    })
    newUserRequestPassword: NewUserRequestPassword,
  ): Promise<User | null> {
    if (!token) {
      throw new HttpErrors.BadRequest('token format not valid');
    }
    const password = await hash(newUserRequestPassword.password, await genSalt());
    var user = await this.userRepository.findOne({where: {verificationToken: token}})
    if (user) {
      var credential = await this.userCredentials.findOne({where: {userId: user.id}})
      if (credential) {
        await this.userCredentials.updateById(credential.id, {password: password})
      } else {
        throw new HttpErrors.BadRequest('token format not valid');
      }
      console.log(user.email)
      return user;
    } else {
      throw new HttpErrors.BadRequest('token format not valid');
    }
  }

  @post('/confirmation/{token}', {
    responses: {
      '200': {
        description: 'Verification Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })

  async confirmation(
    @param.path.string('token') token: string,
  ): Promise<User | null> {
    if (!token) {
      throw new HttpErrors.BadRequest('token format not valid');
    }
    var user = await this.userRepository.findOne({where: {verificationToken: token}})
    if (user) {
      await this.userRepository.updateById(user.id, {verificationToken: "", emailVerified: true})
      return user;
    } else {
      throw new HttpErrors.BadRequest('token format not valid');
    }
  }

  /** * @param credentials */
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
        description: '',
        schema: {
          type: 'string',
        },
      },
    },
  })
  async whoAmI(): Promise<string> {
    return this.user[securityId];
  }
  /**
   * A login function that returns refresh token and access token.
   * @param credentials User email and password
   */
  @post('/users/refresh-login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                },
                refreshToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async refreshLogin(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<TokenObject> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile: UserProfile =
      this.userService.convertToUserProfile(user);
    const accessToken = await this.jwtService.generateToken(userProfile);
    const tokens = await this.refreshService.generateToken(
      userProfile,
      accessToken,
    );
    return tokens;
  }

  @post('/refresh', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
  })
  async refresh(
    @requestBody(RefreshGrantRequestBody) refreshGrant: RefreshGrant,
  ): Promise<TokenObject> {
    return this.refreshService.refreshToken(refreshGrant.refreshToken);
  }
}




