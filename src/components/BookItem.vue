<script setup>
    import { computed } from 'vue'
    const props=defineProps({
        book: Object,
    })
    const colors=new Map([['Important','yellow'],['To Read','lightgrey'],['Done','rgb(0, 212, 0)'],['In Progress','lightblue']])
    const color = computed(() => colors.get(props.book.status))
</script>

<template>
    <span >
        <div class="title">{{book.title}} by {{book.authors.slice(0, 3).join(', ')}}</div>
        <div :style="{ backgroundColor: color }" class="status">{{book.status}}</div>
    </span>
</template>

<style scoped>
    span{
        margin: 4px;
        padding: 5px;
        border: 2px solid var(--vt-c-divider-dark-1);
        border-radius: 8px;
        width: 100%;
        cursor: pointer;
        user-select: none;
        display: flex;
        justify-content: space-between;
    }
    span:hover{
        background-color: var(--vt-c-divider-light-2);
    }
    .title{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .status{
        width: fit-content;
        padding: 0 2px;
        border-radius: 5px;
    }
</style>