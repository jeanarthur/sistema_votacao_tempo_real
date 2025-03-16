const votes = {
    "Eletrônica": 0,
    "Funk": 0,
    "Indie": 0,
    "J-Pop": 0,
    "K-Pop": 0,
    "Metal": 0,
    "Pagode": 0,
    "Pop": 0,
    "Rap": 0,
    "Reggae": 0,
    "Rock": 0,
    "Samba": 0,
    "Sertanejo": 0,
    "Trap": 0,
    "Outros": 0,
};

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