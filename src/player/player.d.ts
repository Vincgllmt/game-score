import { BaseEntity } from "../base/entity";

export type Tour =
    'ATP'   // circuit professionnel masculin
   |'WTA'   // circuit professionnel féminin
;

interface Player extends BaseEntity {
    firstName: string, // prénom du joueur / de la joueuse
    lastName: string,  // nom du joueur / de la joueuse
    tour: Tour,        // circuit dans lequel évolue le joueur / la joueuse
    country: string    // pays du joueur / de la joueuse
}