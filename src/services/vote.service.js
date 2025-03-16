const votes = {
    a: 0,
    b: 0
}

const VoteService = {
    registerVote: async function (vote) {
        return new Promise((resolve, reject) => {
            if (Object.keys(votes).includes(vote)) {
                votes[vote]++;
                resolve(votes);
            } else {
                reject(`[VoteService] [registerVote] Choice '${vote}' is not a valid vote option`);
            }
        })
    },

    getVotes: () => {
        return votes;
    }
}

module.exports = {VoteService}