//Metodo que regresa el enlace para recuperar contraseña
export const enlacePassword = (user: any, tok: string) => {
  return (`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
      <style>

          .header{
              background-color: #032e29;
              align-items: center;
              justify-content: center;
              text-align: center;
              color: white;
              font-family: sans-serif;
              margin-top: 20px;
              padding: 10px;
              margin-bottom: 20px;
          }
          .container{
              align-items: center;
              justify-content: center;
              font-family: sans-serif;
              text-align: center;
          }

          .btnConfirmar{
              display: inline-block;
              border-radius: 4px;
              background-color: #7d2ed1;
              border: none;
              color: #FFFFFF;
              text-align: center;
              font-size: 25px;
              padding: 10px;
              width: 200px;
              transition: all 0.5s;
              cursor: pointer;
              margin: 5px;
          }

          .btnConfirmar:hover{
              background-color: #63068f;
          }

          .link{
              text-align: center;
              text-decoration:none;
              color: #FFFFFF;
          }

          .footer{
              background-color: #eee6f2;
              align-items: center;
              justify-content: center;
              text-align: center;
              color: #000000;
              font-family: sans-serif;
              margin-top: 20px;
              padding: 10px;
              margin-bottom: 20px;
          }
      </style>
  </head>
  <body>
      <div class="header">
          <div>
              <h1>J2A LIGA MX</h1>
          </div>
      </div>
      <div class="container">
          <p>Hola ${user}</p>
          <p>Para recuperar tu contraseña porfavor da click aqui:</p>
          <a class="link" href="https://j2aligamx.vercel.app/session/newPassword?token=${tok}"><button class="btnConfirmar">Confirmar</button></a>
      </div>
      <div class="footer">
          <div>
              <p>© 2022 - J2A-LIGA MX.</p>
          </div>
      </div>
  </body>
  </html>
  `);
}

//Metodo que regresa el enlace para confirmar tu cuenta
export const enlaceConfirm = (user: any, tok: string) => {
  return (`<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>

              .header{
                  background-color: #032e29;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  color: white;
                  font-family: sans-serif;
                  margin-top: 20px;
                  padding: 10px;
                  margin-bottom: 20px;
              }
              .container{
                  align-items: center;
                  justify-content: center;
                  font-family: sans-serif;
                  text-align: center;
              }

              .btnConfirmar{
                  display: inline-block;
                  border-radius: 4px;
                  background-color: #7d2ed1;
                  border: none;
                  color: #FFFFFF;
                  text-align: center;
                  font-size: 25px;
                  padding: 10px;
                  width: 200px;
                  transition: all 0.5s;
                  cursor: pointer;
                  margin: 5px;
              }

              .btnConfirmar:hover{
                  background-color: #63068f;
              }

              .link{
                  text-align: center;
                  text-decoration:none;
                  color: #FFFFFF;
              }

              .footer{
                  background-color: #eee6f2;
                  align-items: center;
                  justify-content: center;
                  text-align: center;
                  color: #000000;
                  font-family: sans-serif;
                  margin-top: 20px;
                  padding: 10px;
                  margin-bottom: 20px;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <div>
                  <h1>J2A LIGA MX</h1>
              </div>
          </div>
          <div class="container">
              <p>Hola ${user}, esto te va encantar !!</p>
              <p>Para confirmar tu correo electrónico haz click en el siguiente botón:</p>
              <a class="link" href="https://j2aligamx.vercel.app/session/confirm?token=${tok}"><button class="btnConfirmar">Confirmar</button></a>
          </div>
          <div class="footer">
              <div>
                  <p>© 2022 - J2A-LIGA MX.</p>
              </div>
          </div>
      </body>
      </html>
      `);
}
