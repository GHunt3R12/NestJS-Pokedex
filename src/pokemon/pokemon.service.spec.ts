import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { PokemonService } from "./pokemon.service";
import { Pokemon } from "./entities/pokemon.entity";
import { CreatePokemonDto } from "./dto/create-pokemon.dto";

describe('PokemonService', () => {

    let pokemonService: PokemonService;
    let model: Model<Pokemon>;

    const mockPokemon = {
        _id: "pokemonId",
        no: "4",
        name: "charmander",
    }

    const mockCreatePokemon = {
        no: 1,
        name: "bulbasaur",
    }

    const mockConfig = { get: jest.fn() }

    const mockPokemonService = {
        create: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        deleteOne: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
            providers: [
                PokemonService,
                {
                    provide: getModelToken(Pokemon.name),
                    useValue: mockPokemonService,
                }
            ]
        }).compile();

        pokemonService = module.get<PokemonService>(PokemonService);
        model = module.get<Model<Pokemon>>(getModelToken(Pokemon.name));

    });

    describe('create', () => {
        it('should create and return a pokemon', async () => {
            jest.spyOn(model, 'create').mockImplementationOnce(() => Promise.resolve([mockPokemon] as any))

            const result = await pokemonService.create(mockCreatePokemon as CreatePokemonDto)

            expect(result).toEqual([mockPokemon]);
        })
    });

    describe('findAll', () => {
        it('should return an array of pokemons', async () => {
            const query = { limit: 10, offset: 0 };

            jest.spyOn(model, 'find').mockImplementation(
                () => ({
                    limit: () => ({
                        skip: jest.fn().mockResolvedValue([mockPokemon]),
                    }),
                } as any),
            );

            const result = await pokemonService.findAll(query);

            expect(result).toEqual([mockPokemon]);
        });
    });

    describe('findOne', () => {

        it('should find and return a pokemon by name', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValue(mockPokemon);

            const result = await pokemonService.findOne(mockPokemon.name);

            expect(model.findOne).toHaveBeenCalledWith({ name: mockPokemon.name });
            expect(result).toEqual(mockPokemon);
        });

        it('should find and return a pokemon by no', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValue(mockPokemon);

            const result = await pokemonService.findOne(mockPokemon.no);

            expect(model.findOne).toHaveBeenCalledWith({ no: mockPokemon.no });
            expect(result).toEqual(mockPokemon);
        });


        it('should throw NotFoundException if pokemon with name not found', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValue(null);

            await expect(pokemonService.findOne(mockPokemon.name)).rejects.toThrow(NotFoundException);

            expect(model.findOne).toHaveBeenCalledWith({ name: mockPokemon.name });
        });

        it('should throw NotFoundException if pokemon with no not found', async () => {
            jest.spyOn(model, 'findOne').mockResolvedValue(null);

            await expect(pokemonService.findOne(mockPokemon.no)).rejects.toThrow(NotFoundException);

            expect(model.findOne).toHaveBeenCalledWith({ no: mockPokemon.no });
        });

    });
    // TODO: Resolver el "update" para el test.
    // describe('update', () => {
    //     it('should update and return a pokemon', async () => {
    //         const updatePokemon = { ...mockPokemon, name: 'charmander' };
    //         const pokemon = { name: 'update name' };

    //         jest.spyOn(model, 'findOne').mockResolvedValue(updatePokemon);

    //         const result = await pokemonService.update(mockPokemon.name, pokemon as any);

    //         expect(model.findOne).toHaveBeenCalledWith(mockPokemon.name, pokemon);

    //         expect(result).toEqual(pokemon);
    //     })
    // });

    describe('delete', () => {
        it('should delete a pokemon', async () => {
            jest.spyOn(model, 'deleteOne').mockResolvedValue(mockPokemon as any);

            const result = await pokemonService.remove(mockPokemon._id);

            expect(model.deleteOne).toHaveBeenCalledWith({ _id: mockPokemon._id });
        })
    });

});
