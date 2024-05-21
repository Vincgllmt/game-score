import { Game, Score } from "./game";

export function updateScore(game: Game, pointWinner: 0 | 1) {
    game.state.scores[pointWinner].points++;
}

export function updateGames(game: Game, pointWinner: 0 | 1) {
    game.state.scores[pointWinner].sets++;
    game.state.scores[0].points = 0;
    game.state.scores[1].points = 0;
    game.state.tieBreak = false
}

export function updateSets(game: Game, pointWinner: 0 | 1) {
    const scoreIndex = game.state.scores.findIndex((score: Score) => score.sets === game.config.sets);
    if (scoreIndex !== -1) {
        game.state.winner = scoreIndex;
    }else{
        game.state.currentSet++;
        game.state.scores[0].games.push(pointWinner);
        game.state.scores[1].games.push(pointWinner);
    }
}
