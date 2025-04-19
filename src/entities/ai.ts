import { Board } from "./board";
import { Cell } from "./cell";
import type { Player } from "./player";

export class AI {
    board: Board;
    players: Player[];

    constructor(board : Board, players: Player[]) {
        this.board = board;
        this.players = players;
    }

    determineNextMove() : Cell {
        // Create a deep copy to not mess with the original cells.
        const board = this.board.clone();

        // Loop through the players.
        // First we check if the computer can win. 
        // If that's not the case, we can check if we can block the player from winning.
        for (let currentPlayerIndex = 1; currentPlayerIndex >= 0; currentPlayerIndex--) {
            for (let colIndex = 0; colIndex < board.colsCount; colIndex++) {
                const cell = board.getLastEmptyCellInColumn(colIndex);
                if (!cell) {
                    continue;
                }

                cell.player = this.players[currentPlayerIndex];
                const win = board.hasWon(cell.colIndex, cell.rowIndex, cell.player);
                cell.player = null;
                if (win) {
                    return cell;
                }
            }
        }

        // Else we'll just take a random cell.
        const availableColumns = board.columns.filter((_, colIndex) => !board.isFullColumn(colIndex));
        const availableColumnIndex = Math.floor(Math.random() * availableColumns.length);
        let finalRowIndex = 0;

        for (let rowIndex = board.rowsCount - 1; rowIndex >= 0; rowIndex--) {
            if (availableColumns[availableColumnIndex][rowIndex].player === null) {
                finalRowIndex = rowIndex;
            }
        }

        return availableColumns[availableColumnIndex][finalRowIndex];
    }
}
