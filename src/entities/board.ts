import { Cell } from "./cell";
import type { Player } from "./player";

export class Board {
    rowsCount: number = 6;
    colsCount: number = 7;
    columns: Cell[][];

    constructor() {
        this.columns = [];

        for (let c = 0; c < this.colsCount; c++) {
            this.columns[c] = [];

            for (let r = 0; r < this.rowsCount; r++) {
                this.columns[c][r] = new Cell();
            }
        }
    }

    isFull(): boolean {
        return this.columns.every((_, colIndex) => this.isFullColumn(colIndex))
    }

    isFullColumn(colIndex: number): boolean {
        return this.columns[colIndex][0].player !== null;
    }

    isFullCell(colIndex: number, rowIndex: number): boolean {
        return this.columns[colIndex][rowIndex].player !== null;
    }

    isEmptyCell(colIndex: number, rowIndex: number): boolean {
        return this.columns[colIndex][rowIndex].player === null;
    }

    isLastCellInColumn(rowIndex: number): boolean {
        return rowIndex === this.rowsCount - 1;
    }

    isLastEmptyCellInColumn(colIndex: number, rowIndex: number): boolean {
        return this.isLastCellInColumn(rowIndex) || this.isFullCell(colIndex, rowIndex + 1);
    }

    getPlayerAt(colIndex: number, rowIndex: number): Player | null {
        return this.columns[colIndex][rowIndex].player;
    }

    dropDisc(colIndex: number, rowIndex: number, player: Player): void {
        if (rowIndex > 0) {
            this.columns[colIndex][rowIndex - 1].player = null;
        }

        this.columns[colIndex][rowIndex].player = player;
    }

    reset(): void {
        this.columns.forEach(row => {
            row.forEach(cell => {
                cell.player = null;
            });
        });
    }

    hasWon(col: number, row: number, player: Player): boolean {
        const directions = [
            [0, 1],  // horizontal
            [1, 0],  // vertical
            [1, 1],  // diagonal down-right
            [1, -1], // diagonal up-right
        ];

        for (const [dx, dy] of directions) {
            let count = 1;
            for (const dir of [-1, 1]) {
                let r = row + dir * dx;
                let c = col + dir * dy;

                while (
                    r >= 0 && r < this.rowsCount &&
                    c >= 0 && c < this.colsCount &&
                    this.columns[c][r].player?.index === player.index
                ) {
                    count++;
                    r += dir * dx;
                    c += dir * dy;
                }
            }

            if (count >= 4) {
                return true;
            }
        }

        return false;
    }
}
