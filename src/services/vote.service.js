const VoteModel = require("../models/vote")

// const votes = {
//     "Eletrônica": 0,
//     "Funk": 0,
//     "Indie": 0,
//     "J-Pop": 0,
//     "K-Pop": 0,
//     "Metal": 0,
//     "Pagode": 0,
//     "Pop": 0,
//     "Rap": 0,
//     "Reggae": 0,
//     "Rock": 0,
//     "Samba": 0,
//     "Sertanejo": 0,
//     "Trap": 0,
//     "Outros": 0,
// };

const VoteService = {
    _votation: null,

    init: async function () {
        const voteModel = await VoteModel.findById(process.env.VOTE_ID);
        if (voteModel === null) {

        }

        console.log(voteModel)
        this._votation = voteModel;
    },

    registerVote: async function (vote) {
        return new Promise(async (resolve, reject) => {
            if (Object.keys(this._votation.votes).includes(vote)) {
                this._votation.votes[vote]++;

                try{
                    const vote = new VoteModel({
                        name: `Update-${Date.now().toLocaleString('pt-br')}`,
                        votes: this._votation.votes
                    })
                    const savedVote = await vote.save()
            
                    resolve(this._votation.votes);
                }
                catch(err){
                    reject(`[VoteService] [registerVote] Error on save vote in Database`)
                }

            } else {
                reject(`[VoteService] [registerVote] Choice '${vote}' is not a valid vote option`);
            }
        })
    },

    getVotes: async () => {
        return new Promise(async (resolve, reject) => {
            if (this._votation?.votes) {
                resolve(this._votation?.votes);
            }

            const voteModel = await VoteModel.findById(process.env.VOTE_ID);
            if (voteModel === null) {
                reject(`[VoteService] [getVotes] Database with id ${process.env.VOTE_ID} not exists`);
            }

            this._votation = voteModel;
            resolve(this._votation?.votes ?? {});
        });
    }
}

module.exports = {VoteService}