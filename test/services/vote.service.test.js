const { expect } = require('chai');
const sinon = require('sinon');
const { VoteService } = require('../../src/services/vote.service');
const VoteModel = require('../../src/models/vote.model');

describe('VoteService', () => {
    let mockVotation;
    let sandbox;
    
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        
        mockVotation = {
            _id: '67f1b4aa572ee1d85a065ba8',
            title: 'Teste de Votação',
            description: 'Descrição do teste',
            options_title: 'Opções de teste',
            votes: {
                'Opção 1': 0,
                'Opção 2': 0
            }
        };

        VoteService._votation = null;
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getVotes', () => {
        it('deve retornar os votos do banco de dados', async () => {
            const findByIdStub = sandbox.stub(VoteModel, 'findById').resolves(mockVotation);
            const result = await VoteService.getVotes();
            expect(result).to.deep.equal(mockVotation);
            expect(findByIdStub.calledOnce).to.be.true;
        });

        it('deve retornar votação em cache se disponível', async () => {
            VoteService._votation = mockVotation;
            const findByIdStub = sandbox.stub(VoteModel, 'findById');
            const result = await VoteService.getVotes();
            expect(result).to.deep.equal(mockVotation);
            expect(findByIdStub.called).to.be.false;
        });

        it('deve rejeitar quando o banco de dados retorna erro', async () => {
            const dbError = new Error('Erro de conexão');
            sandbox.stub(VoteModel, 'findById').rejects(dbError);

            try {
                await VoteService.getVotes();
                expect.fail('Deveria ter lançado um erro');
            } catch (error) {
                expect(error).to.equal(dbError);
            }
        });

        it('deve rejeitar quando ID da votação não existe', async () => {
            sandbox.stub(VoteModel, 'findById').resolves(null);

            try {
                await VoteService.getVotes();
                expect.fail('Deveria ter lançado um erro');
            } catch (error) {
                expect(error).to.be.a('string');
                expect(error).to.include('Database with id');
            }
        });
    });

    describe('registerVote', () => {
        it('deve registrar um voto válido com sucesso', async () => {
            const updateOneStub = sandbox.stub().resolves({});
            const mockVoteModel = { updateOne: updateOneStub };
            
            sandbox.stub(VoteModel, 'findById').returns(mockVoteModel);
            sandbox.stub(VoteService, 'getVotes').resolves(mockVotation);

            const result = await VoteService.registerVote('Opção 1');
            expect(result.votes['Opção 1']).to.equal(1);
            expect(updateOneStub.calledOnce).to.be.true;
        });

        it('deve rejeitar um voto inválido', async () => {
            sandbox.stub(VoteService, 'getVotes').resolves(mockVotation);

            try {
                await VoteService.registerVote('Opção Inválida');
                expect.fail('Deveria ter lançado um erro');
            } catch (error) {
                expect(error).to.be.a('string');
                expect(error).to.include('is not a valid vote option');
            }
        });

        it('deve rejeitar quando ocorre erro ao salvar voto', async () => {
            const updateError = new Error('Erro ao atualizar');
            const updateOneStub = sandbox.stub().rejects(updateError);
            const mockVoteModel = { updateOne: updateOneStub };

            sandbox.stub(VoteModel, 'findById').returns(mockVoteModel);
            sandbox.stub(VoteService, 'getVotes').resolves(mockVotation);

            try {
                await VoteService.registerVote('Opção 1');
                expect.fail('Deveria ter lançado um erro');
            } catch (error) {
                expect(error).to.be.a('string');
                expect(error).to.include('Error on save vote in Database');
                expect(error).to.include(updateError.message);
            }
        });

        it('deve rejeitar quando getVotes falha', async () => {
            const getVotesError = new Error('Erro ao obter votos');
            sandbox.stub(VoteService, 'getVotes').rejects(getVotesError);

            try {
                await VoteService.registerVote('Opção 1');
                expect.fail('Deveria ter lançado um erro');
            } catch (error) {
                expect(error).to.equal(getVotesError);
            }
        });
    });
}); 