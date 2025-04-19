import type { Player } from "./player";

export class Cell {
    colIndex: number;
    rowIndex: number;
    player: Player | null;

    constructor(colIndex: number, rowIndex: number, player: Player | null = null) {
        this.colIndex = colIndex;
        this.rowIndex = rowIndex;
        this.player = player;
    }

    clone(): Cell {
        return new Cell(this.colIndex, this.rowIndex, this.player);
    }

    reset() : void {
        this.player = null;
    }
}