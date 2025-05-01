<script setup>
import { ref } from 'vue'
import { useReadingListStore } from '@/stores/readingList'
const store=useReadingListStore()

let tags=ref(new Set())
for (const book of store.books) {
    if(book.categories){
        for(const tag of book.categories) {
            tags.value.add(tag); 
        }
    }
}
const emit=defineEmits(['close'])


</script>
<template>
    <div class="panel">
        <div class="content">
            <select v-model="store.sort">
                <option value="status">Sort By Status</option>
                <option value="rating">Sort By Rating</option>
                <option value="authorAlphabetical">Author Alphabetical</option>
                <option value="titleAlphabetical">Title Alphabetical</option>
            </select>
            <button id="close" @click="emit('close')">✕</button>
            
            <div class="tag-selector">
                <span>Prioritize Tags:</span>
                <div class="tag-options">
                  <label v-for="tag in tags" :key="tag">
                    <input type="checkbox" 
                           :value="tag" 
                           v-model="store.sortTags">
                    {{tag}}
                  </label>
                </div>
            </div>

        </div>
    </div>
</template>
<style scoped>
.panel {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 5;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 0.2rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: 200px;
}
.content{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 2px;
}
span{
    font-size: 1rem;
    font-weight: 700;
}
.tag-options{
    width: 190px;
    padding: 3px;
    display: flex;
    flex-direction: column;
    max-height: 200px;
    overflow-y: scroll;
}
#close{
    width: 20px;
    height: 20px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 1rem;
    color: #666;
    padding: 0;
}
#close:hover{
    font-size: 0.8rem;
    color: #525252;
}
</style>