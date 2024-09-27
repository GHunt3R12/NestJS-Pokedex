import { Test, TestingModule } from "@nestjs/testing";
import { PokemonService } from "./pokemon.service";
import { PokemonController } from "./pokemon.controller";
import { CreatePokemonDto } from "./dto/create-pokemon.dto";
import { UpdatePokemonDto } from "./dto/update-pokemon.dto";

describe('PokemonController', () => {

    let pokemonService: PokemonService;
    let pokemonController: PokemonController;

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
        findAll: jest.fn().mockResolvedValueOnce([mockPokemon]),
        findOne: jest.fn().mockResolvedValueOnce(mockPokemon),
        update: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PokemonController],
            providers: [
                {
                    provide: PokemonService,
                    useValue: mockPokemonService,
                },
            ],
        }).compile();

        pokemonService = module.get<PokemonService>(PokemonService);
        pokemonController = module.get<PokemonController>(PokemonController);

    });

    it('should be defined', () => {
        expect(pokemonController).toBeDefined();
    });

    describe('create', () => {
        it('should create a new pokemon', async () => {
            mockPokemonService.create = jest.fn().mockResolvedValueOnce(mockPokemon);

            const result = await pokemonController.create(mockCreatePokemon as CreatePokemonDto);


            expect(pokemonService.create).toHaveBeenCalled();
            expect(result).toEqual(mockPokemon);
        });
    });

    describe('findAll', () => {
        it('should get all pokemons', async () => {
            const result = await pokemonController.findAll({ limit: 10, offset: 0 });

            expect(pokemonService.findAll).toHaveBeenCalled();
            expect(result).toEqual([mockPokemon]);
        });
    });

    describe('findOne', () => {
        it('should get a pokemon by name', async () => {
            const result = await pokemonController.findOne(mockPokemon.name);

            expect(pokemonService.findOne).toHaveBeenCalled();
            expect(result).toEqual(mockPokemon);
        });
    });

    describe('update', () => {
        it('should update pokemon by its id', async () => {
            const updatePokemon = { ...mockPokemon, _id: 'updated name' };
            const pokemon = { _id: 'updated name' };

            mockPokemonService.update = jest.fn().mockResolvedValueOnce(updatePokemon);

            const result = await pokemonController.update(mockPokemon._id, pokemon as UpdatePokemonDto);

            expect(pokemonService.update).toHaveBeenCalled();
            expect(result).toEqual(updatePokemon);
        });
    });

    describe('remove', () => {
        it('should delete a pokemon by id', async () => {
            const result = await pokemonController.remove(mockPokemon._id);

            expect(pokemonService.remove).toHaveBeenCalled();
        });
    });
});