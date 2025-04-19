import type { Player } from "./player";

export class Cell {
    player: Player | null;

    constructor(player: Player | null = null) {
        this.player = player;
    }

    clone(): Cell {
        return new Cell(this.player);
    }

    reset() : void {
        this.player = null;
    }
}