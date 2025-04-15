const VoteModel = require("../models/vote.model")

const VoteService = {
    _votation: null,

    registerVote: async function (vote) {
        try {
            const votation = await this.getVotes();
            const votes = votation?.votes;
            
            if (!votes || !Object.keys(votes).includes(vote)) {
                throw `[VoteService] [registerVote] Choice '${vote}' is not a valid vote option`;
            }

            votes[vote]++;
            if (votation) votation.votes = votes;

            try {
                await VoteModel.findById(process.env.VOTE_ID)
                    .updateOne({votes: votes});
                return votation;
            } catch(err) {
                throw `[VoteService] [registerVote] Error on save vote in Database. [${err.message}]`;
            }
        } catch (error) {
            throw error;
        }
    },

    getVotes: async function() {
        try {
            if (this._votation) {
                return this._votation;
            }

            const voteModel = await VoteModel.findById(process.env.VOTE_ID);
            if (!voteModel) {
                throw `[VoteService] [getVotes] Database with id ${process.env.VOTE_ID} not exists`;
            }

            this._votation = voteModel;
            return this._votation;
        } catch (error) {
            if (error.message) {
                throw error;
            }
            throw error;
        }
    }
}

module.exports = {VoteService}