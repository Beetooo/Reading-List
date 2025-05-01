<script setup>
import { ref } from 'vue'
import BookItem from "@/components/BookItem.vue"

const emit = defineEmits(['clickBook'])
defineProps({
    books: Array,
    current: Number,
    view: String
})

const draggedItemIndex = ref(null);
const dragOverIndex = ref(null);

const onDragStart = (index, event) => {
  draggedItemIndex.value = index;
  event.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData('text/plain', index);
};
const onDragOver = (index, event) => {
  if (index === draggedItemIndex.value) {
    dragOverIndex.value = null;
    return;
  }
  // Determine if we should show the indicator before or after the current item
  const rect = event.currentTarget.getBoundingClientRect();
  const midPoint = rect.top + rect.height / 2;
  event.clientY < midPoint ? dragOverIndex.value=index : dragOverIndex.value=index+1;
};

//needs improvement
const onDrop = (dropIndex, event) => {
  const itemToMove = books[draggedItemIndex.value];
  
  books.splice(draggedItemIndex.value, 1);
  
  // Adjust target index if needed
  let adjustedDropIndex = dragOverIndex.value;
  if (draggedItemIndex.value < dragOverIndex.value) {
    adjustedDropIndex--;
  }
  
  books.splice(adjustedDropIndex, 0, itemToMove);
  
  draggedItemIndex.value = null;
  dragOverIndex.value = null;
};
const onDragEnd = () => {
  draggedItemIndex.value = null;
  dragOverIndex.value = null;
};
</script>
<template>
    <div class="root">
      <div id="list-view" v-if="view=='listView'"> 
        <div class="book-container-list" v-for="(book,index) in books">
            <div class="drop-indicator" 
            :class="{ 'active': dragOverIndex === index && draggedItemIndex !== index }"></div>
            <BookItem
              :class="{'current': current!=-1 && books[current].title===book.title}"
              :book="book"
              draggable="true"
              @click="() => emit('clickBook', index)"
              @dragstart="onDragStart(index, $event)"
              @dragover.prevent="onDragOver(index, $event)"
              @dragend="onDragEnd"
              @drop="onDrop(index, $event)"
            />
        </div>
        <!-- Final drop indicator for the last position -->
        <div class="drop-indicator" :class="{ 'active': dragOverIndex === books.length }"></div>
      </div>
      <div id="grid-view" v-if="view=='gridView'"> 
        <div class="book-container-grid" v-for="(book,index) in books">
          <img
            :class="{'current': current!=-1 && books[current].title===book.title}"
            :book="book"
            @click="() => emit('clickBook', index)"
            :src="book.imageLinks.thumbnail" 
            :alt="book.title"
          >
        </div>
      </div>
    </div>
</template>

<style scoped>
    .root{
        padding: 12px;
        padding-top: 0;
        width: 100%;
        overflow-y: auto;
        scrollbar-gutter: stable;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    #list-view{
      width: 100%;
    }
    .book-container-list{
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .drop-indicator {
        width: 100%;
        height: 0;
        transition: height 0.2s ease, opacity 0.2s ease;
        background-color: #3498db;
        opacity: 0;
        border-radius: 2px;
        margin: 0;
    }
    .drop-indicator.active {
        height: 3px;
        opacity: 1; 
        margin: 4px 0; 
    }
    #grid-view{
      width: 100%;
      display: grid;
      justify-content: space-evenly;
      grid-template-columns: repeat(auto-fit,128px);
      gap: 0.5rem;
      
    }
    .book-container-grid{
      width: fit-content;
    }
    img{
      border: 3px solid var(--vt-c-black-mute);
      border-radius: 4px;
      box-shadow: 0 4px 8px var(--vt-c-black-mute);
    }
    .current{
      border-color: blue;
      box-shadow: 0 4px 8px rgb(57, 57, 109);
    }
</style>