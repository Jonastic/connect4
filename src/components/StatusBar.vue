<script setup lang="ts">
import { useScoreStore } from '../stores/score';

const score = useScoreStore();
</script>

<template>
    <div class="status-bar">
        <span title="Losses">❌ {{ score.losses }}</span>
        <span title="Draws">🟰 {{ score.draws }}</span>
        <span title="Wins">✅ {{ score.wins }}</span> 
        <span title="Current win streak">🔥 {{ score.currentStreak }}</span> 
        <span title="Max win streak">🏆 {{ score.maxStreak }}</span> 
    </div>
</template>