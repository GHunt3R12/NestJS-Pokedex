import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonShema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    // Clase no.105.
    ConfigModule,
    //Clase no.75.
    MongooseModule.forFeature([
      {
        name: Pokemon.name,
        schema: PokemonShema,
      }
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class PokemonModule { }
