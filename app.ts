import 'dotenv/config'
import Server from './src/server'
//para llamar la configuracion por defecto que va a llamar a las variables de entorno 

const server = new Server()

server.listen()