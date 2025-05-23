<script setup lang="ts">
import { ref } from 'vue'
import { Player } from '../entities/player';
import { Board } from '../entities/board';
import { useScoreStore } from '../stores/score';
import { AI } from '../entities/ai';

const score = useScoreStore();

const showOverlay = ref(false);
const winner = ref<Player | null>(null);

const board = ref<Board>(new Board());
const players = ref([
  new Player(0, 'Player', '#2a9d8f'),
  new Player(1, 'Computer', '#e76f51')
]);
const currentPlayer = ref<Player>(players.value[0]);

const hoveredCol = ref<number | null>(null);
const isAnimating = ref(false);

function handleClick(colIndex: number) {
  if (winner.value || isAnimating.value || board.value.isFullColumn(colIndex)) {
    return;
  }

  isAnimating.value = true;
  for (let rowIndex = 0; rowIndex < board.value.rowsCount; rowIndex++) {
    if (board.value.isFullCell(colIndex, rowIndex)) {
      break;
    }

    setTimeout(() => {
      board.value.dropDisc(colIndex, rowIndex, currentPlayer.value);

      if (board.value.isLastEmptyCellInColumn(colIndex, rowIndex)) {
        isAnimating.value = false;

        if (board.value.hasWon(colIndex, rowIndex, currentPlayer.value)) {
          endGame(currentPlayer.value);
          return;
        } 
        
        if (board.value.isFull()) {
          endGame(null);
          return;
        }

        currentPlayer.value = players.value[currentPlayer.value.index === 0 ? 1 : 0];

        if (currentPlayer.value.index === 1) {
          chooseForComputer();
        }
      }
    }, 50 * (rowIndex + 1));
  }
}

function endGame(player: Player | null) {
  winner.value = player
  showOverlay.value = true

  if (player?.index === 0) {
    score.addWin();
  } else if (player?.index === 1) {
    score.addLoss();
  } else {
    score.addDraw();
  }
}

function nextGame() {
  board.value.reset();

  currentPlayer.value = players.value[0];
  showOverlay.value = false
  winner.value = null
}

function chooseForComputer() {
  const ai = new AI(board.value, players.value);
  const cell = ai.determineNextMove()
  
  handleClick(cell.colIndex);
}
</script>

<template>
  <transition name="fade">
    <div v-if="showOverlay" class="overlay">
      <div class="overlay-content">
        <template v-if="winner?.index === 0">
          <div>🧑‍💻</div>
          <div>Player wins!</div>
        </template>
        <template v-else-if="winner?.index === 1">
          <div>🤖</div>
          <div>Computer wins!</div>
        </template>
        <template v-else>
          <div>🤝</div>
          <div>It's a draw!</div>
        </template>

        <button @click="nextGame">▶ Next Game</button>
      </div>
    </div>
  </transition>

  <div class="board" :class="{ 'disabled': currentPlayer.index === 1 }">
    <div v-for="(_, colIndex) in board.columns" :key="colIndex" class="column" @click="handleClick(colIndex)"
      @mouseenter="hoveredCol = colIndex" @mouseleave="hoveredCol = null">

      <div v-if="hoveredCol === colIndex && !isAnimating && !board.isFullColumn(colIndex) && currentPlayer.index === 0" class="ghost-disk"
        :style="{ backgroundColor: currentPlayer.color }" />

      <div v-for="(_, rowIndex) in board.rowsCount" :key="rowIndex" class="cell">
        <div class="disc" :style="{ backgroundColor: board.getPlayerAt(colIndex, rowIndex)?.color }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 20px auto;
}

.board.disabled {
  pointer-events: none;
}

.column {
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.cell {
  width: 40px;
  height: 40px;
  background: #fff;
  margin: 2px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

.disc {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: transparent;
  transition: background 0.1s;
}

.ghost-disk {
  position: absolute;
  top: -40px;
  left: 3px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  opacity: 0.6;
  transition: opacity 0.2s;
  pointer-events: none;
  z-index: 5;
  filter: brightness(1.2);
}

.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.overlay-content {
  background: white;
  color: #242424;
  padding: 2rem 3rem;
  border-radius: 1rem;
  text-align: center;
  font-size: 1.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

button {
  margin-top: 1rem;
  font-size: 1.1rem;
  padding: 0.6rem 1.2rem;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
