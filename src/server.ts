import { connectDB } from "./infrastructure/database"; // Importar la función de conexión
import 'dotenv/config'
import express, { Application } from "express";
import cors from 'cors'
import indexRoute from './infrastructure/routes'

class Server {

    private app: Application;
    private port: string;

    constructor() {
        this.app = express()
        this.port = process.env.PORT || '8000'

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación 
        this.routes();

    }


    middlewares() {
        //Cors
        this.app.use(cors());

        // lectura y parseo del body
        this.app.use(express.json())

        //Directorio publico 
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use('/api', indexRoute);
    }

    listen = async () => {

        try {
            await connectDB(); // Esperar a que se complete la conexión a la base de datos

            this.app.listen(this.port, () => {
                console.log(`Server is running on port ${this.port}`);
            });
        } catch (error) {
            console.error("Error connecting to the database:", error);
        }
    }

}

export default Server