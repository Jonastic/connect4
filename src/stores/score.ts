import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useScoreStore = defineStore('score', () => {
    const wins = ref<number>(0);
    const losses = ref<number>(0);
    const draws = ref<number>(0);
    const currentStreak = ref(0);
    const maxStreak = ref(0);

    // Load from localStorage on init.
    const saved = localStorage.getItem('connect4-scores')
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            wins.value = parsed.wins ?? 0;
            losses.value = parsed.losses ?? 0;
            draws.value = parsed.draws ?? 0;
            currentStreak.value = parsed.currentStreak ?? 0;
            maxStreak.value = parsed.maxStreak ?? 0;
        } catch {
            console.warn('Could not parse saved scores.');
        }
    }

    // Watch and persist to localStorage.
    watch([wins, losses, draws], () => {
        localStorage.setItem(
            'oxo-scores',
            JSON.stringify({
                wins: wins.value,
                losses: losses.value,
                draws: draws.value,
                currentStreak: currentStreak.value,
                maxStreak: maxStreak.value,
            })
        )
    })

    function resetScores() {
        wins.value = 0;
        losses.value = 0;
        draws.value = 0;
        currentStreak.value = 0;
        maxStreak.value = 0;
    }

    function addWin() {
        currentStreak.value++;

        if (currentStreak.value > maxStreak.value) {
            maxStreak.value = currentStreak.value
        }
        
        wins.value++;
    }

    function addLoss() {
        currentStreak.value = 0;
        losses.value++;
    }

    function addDraw() {
        draws.value++;
    }

    return {
        wins,
        losses,
        draws,
        currentStreak,
        maxStreak,
        resetScores,
        addWin,
        addLoss,
        addDraw,
    }
});
