<script setup>
defineProps({
    modelValue: Number
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="rating">
        <input type="range" :value="modelValue" @input="(e)=>emit('update:modelValue', Number(e.target.value))" min="0" max="10" step="0.1" />
        <p>Rating: {{ modelValue }}/10</p>
    </div>
</template>

<style scoped>
input{
    width: 100%;
}
.rating{
    width: 100%;
    padding: 5px 0;
}
</style>