const VoteModel = require("../models/vote.model")

const VoteService = {
    _votation: null,

    registerVote: async function (vote) {
        return new Promise(async (resolve, reject) => {
            this.getVotes().then((votes) => {
                if (Object.keys(votes).includes(vote)) {
                    votes[vote]++;
                    try{
                        VoteModel.findById(process.env.VOTE_ID)
                            .updateOne({votes: votes})
                            .then(_ => {
                                resolve(votes);
                            });
                    }
                    catch(err){
                        reject(`[VoteService] [registerVote] Error on save vote in Database. [${err}]`);
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
                return;
            }

            const voteModel = await VoteModel.findById(process.env.VOTE_ID);
            if (voteModel === null) {
                reject(`[VoteService] [getVotes] Database with id ${process.env.VOTE_ID} not exists`);
                return;
            }

            this._votation = voteModel;
            resolve(this._votation?.votes ?? {});
        });
    }
}

module.exports = {VoteService}