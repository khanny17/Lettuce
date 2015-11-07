//File for holding all of the configurations.
//This makes it easy to swap out constants throughout the app

module.exports = {



    //Configuration for riot services
    riot: {
        apiKey: process.env.RIOT_API_KEY,
        //The interval at which to pull data from riot
        updateInterval: '00 00 * * * *', //should hopefully execute every hour

        ourTeam: ['khanny17', 'crappycupojoe', 'jaysig112', 'Evlzilla', 'TheHasbrouck'],

        endpointUrls: {
            summoner: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/'
        }
    }

};
