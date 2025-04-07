const VoteModel = require("../models/vote.model")

const VoteService = {
    _votation: null,

    registerVote: async function (vote) {
        return new Promise(async (resolve, reject) => {
            this.getVotes().then((votation) => {
                const votes = votation?.votes;
                if (Object.keys(votes).includes(vote)) {
                    votes[vote]++;
                    if (votation) votation.votes = votes;
                    try{
                        VoteModel.findById(process.env.VOTE_ID)
                            .updateOne({votes: votes})
                            .then(_ => {
                                resolve(votation);
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
            if (this._votation) {
                resolve(this._votation);
                return;
            }

            const voteModel = await VoteModel.findById(process.env.VOTE_ID);
            if (voteModel === null) {
                reject(`[VoteService] [getVotes] Database with id ${process.env.VOTE_ID} not exists`);
                return;
            }

            this._votation = voteModel;
            resolve(this._votation ?? {});
        });
    }
}

module.exports = {VoteService}