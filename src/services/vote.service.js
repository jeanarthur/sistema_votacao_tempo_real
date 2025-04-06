const VoteModel = require("../models/vote.model")

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

    registerVote: async function (vote) {
        return new Promise(async (resolve, reject) => {
            this.getVotes().then((votes) => {
                if (Object.keys(votes).includes(vote)) {
                    votes[vote]++;
                    try{
                        VoteModel.updateOne({_id: process.env.VOTE_ID, votes: votes})
                            .then(_ => resolve(votes));
                    }
                    catch(err){
                        reject(`[VoteService] [registerVote] Error on save vote in Database`)
                    }

                } else {
                    reject(`[VoteService] [registerVote] Choice '${vote}' is not a valid vote option`);
                }
            });
        });
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