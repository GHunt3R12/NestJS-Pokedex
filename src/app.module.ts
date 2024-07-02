import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/app.config';
import { JoiValidationSchema } from './config/joi.validation';

@Module({
  imports: [

    // Clase no.104.
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // Clase no.74.
    //Se sustituye "localhost" por "127.0.0.1". Esto se debe a que Node.js 18 y versiones posteriores prefieren direcciones IPv6.
    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'pokemondb'
    }),

    PokemonModule,

    CommonModule,

    SeedModule
  ],
})
export class AppModule { }
