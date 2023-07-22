const pool = require('../src/config/db');

const Utils = {

    // Initialize the database to default settings.
    async initializeDatabase() {
        await Utils.clearDataBase();
        //await User.createDummyUser();
    },

    // Clears everything inside the database.
    async clearAllDataBase() {
        await this.clearUserDatabase();
        await this.clearLeagues();
        await this.clearTeams();
        return;
    },

    // Clears everything related to users inside the database.
    // In this case, the information about leagues and teams will persist.
    async clearUserDatabase() {
        await this.clearUser();
        await this.clearFixtures();
        await this.clearGameInterests();
        await this.clearLeagueInterests();
        await this.clearLeagues();
        await this.clearTeams();
        await this.clearTeamInterests();
        return;
    },

    // Clear the users database.
    async clearUser() {
        await pool.query('DELETE FROM users');
        return;
    },

    // Clear the fixtures database.
    async clearFixtures() {
        await pool.query('DELETE FROM fixtures');
        return;
    },

    // Clear the game_interests database.
    async clearGameInterests() {
        await pool.query('DELETE FROM game_interests');
        return;
    },

    // Clear the league_interests database.
    async clearLeagueInterests() {
        await pool.query('DELETE FROM league_interests');
        return;
    },

    // Clear the leagues database.
    async clearLeagues() {
        await pool.query('DELETE FROM leagues');
        return;
    },

    // Clear the teams database.
    async clearTeams() {
        await pool.query('DELETE FROM teams');
        return;
    },

    // Clear the team_interests database.
    async clearTeamInterests() {
        await pool.query('DELETE FROM team_interests');
        return;
    },

    // Validates that the access token is valid.
}

module.exports = Utils;
