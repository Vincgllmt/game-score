import { BaseEntity } from "../base/entity";

export type Score = {
    sets: number,   // manches remportées
    games: number[],// jeux remportés dans chaque manche
    points: number, // points remportés durant le jeu en cours.
                    // Pour un jeu normal (non décisif) : 0 -> 0, 1 -> 15, 2 -> 30, 3 -> 40, 4 -> avantage
}

export interface Game extends BaseEntity {
    players: {
        player1: Player,
        player2: Player,
    },
    config: {
        tour: Tour,
        sets: number,       // nombre de manches nécessaires pour remporter le match
    },
    state: {
        currentSet: number, // 0 = 1er set, 1 = 2e set, ...
        tieBreak: boolean,  // le jeu en cours est-il un jeu décisif ?
        scores: Score[2],   // scores[0] = scores du joueur 1, scores[1] = scores du joueur 2
        winner?: number,    // 0 (joueur 1 vainqueur) ou 1 (joueur 2 vainqueur)
    },
}