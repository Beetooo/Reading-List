<script setup>
import { ref } from 'vue'
import SortPanel from '@/components/SortPanel.vue'
defineProps({
    selectedTags: Array,
    hiddenTags: Array,
    view:String
})
const emit = defineEmits(['updateTags','updateHidden','update:view'])
const searchBar=ref(false)
const sorting=ref(false)

</script>

<template>
    <header>
        <div class="tags">
            <button 
                :class="{ selected: selectedTags.includes('To Read'), hidden: hiddenTags.includes('To Read') }"
                @click="emit('updateTags', 'To Read')"
                @contextmenu.prevent="emit('updateHidden', 'To Read')">
                To Read
            </button>
            <button 
                :class="{ selected: selectedTags.includes('Done'), hidden: hiddenTags.includes('Done') }"
                @click="emit('updateTags', 'Done')"
                @contextmenu.prevent="emit('updateHidden', 'Done')">
                Done
            </button>
            <div class="vl"></div>
            <button 
                :class="{ selected: selectedTags.includes('Fiction'), hidden: hiddenTags.includes('Fiction')}"
                @click="emit('updateTags', 'Fiction')"
                @contextmenu.prevent="emit('updateHidden', 'Fiction')">
                Fiction
            </button>
            <button 
                :class="{ selected: selectedTags.includes('Non-Fiction'), hidden: hiddenTags.includes('Non-Fiction') }"
                @click="emit('updateTags', 'Non-Fiction')"
                @contextmenu.prevent="emit('updateHidden', 'Non-Fiction')">
                Non-Fiction
            </button>
        </div>
        <div class="filter">
            <button id="sort-button" :disabled="sorting" @click="sorting=true"><svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#1f1f1f"><path d="M144-264v-72h240v72H144Zm0-180v-72h432v72H144Zm0-180v-72h672v72H144Z"/></svg></button>
            <button id="search-button" @click="searchBar = true"><svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#1f1f1f"><path d="M765-144 526-383q-30 22-65.79 34.5-35.79 12.5-76.18 12.5Q284-336 214-406t-70-170q0-100 70-170t170-70q100 0 170 70t70 170.03q0 40.39-12.5 76.18Q599-464 577-434l239 239-51 51ZM384-408q70 0 119-49t49-119q0-70-49-119t-119-49q-70 0-119 49t-49 119q0 70 49 119t119 49Z"/></svg></button>
            <div id="searchbar" v-if="searchBar">
                <input 
                    @keyup.enter="emit('searched',$event.target.value)"
                    placeholder="Search..." 
                    aria-label="Search"
                />
                <button id="close" @click="searchBar = false; emit('searched','')">✕</button>
            </div>
            <button id="list-view" :disabled="view=='listView'" @click="emit('update:view','listView')"><svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#1f1f1f"><path d="M144-240v-72h672v72H144Zm0-136v-72h672v72H144Zm0-136v-72h672v72H144Zm0-136v-72h672v72H144Z"/></svg></button>
            <button id="grid-view" :disabled="view=='gridView'" @click="emit('update:view','gridView')"><svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#1f1f1f"><path d="M144-528v-288h288v288H144Zm0 384v-288h288v288H144Zm384-384v-288h288v288H528Zm0 384v-288h288v288H528ZM216-600h144v-144H216v144Zm384 0h144v-144H600v144Zm0 384h144v-144H600v144Zm-384 0h144v-144H216v144Zm384-384Zm0 240Zm-240 0Zm0-240Z"/></svg></button>
        </div>
        <teleport to='#sort-panel' v-if="sorting" >
        
            <SortPanel @close="sorting=false"></SortPanel>
        </teleport>
    </header>
</template>
<style scoped>
    header{
        padding: 12px 12px 0 12px;
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        gap: 2px;
        justify-content: space-between;
    }
    button{
        border: 2px solid rgb(70, 70, 70);
        border-radius: 5px;
    }
    .selected{
        border: 2px solid rgb(0, 202, 0);
    }
    .selected:hover{
        border-color: rgb(0, 144, 0);
    }
    .hidden{
        border: 2px solid red;

    }
    .hidden:hover{
        border-color: rgb(153, 0, 0);
    }
    .tags{
        display: flex;
        justify-content: space-between;
        gap: 4px;
        align-items: center;
    }
    .vl{
        height: 20px;
        width: 1.5px;
        background-color: black;
        opacity: 0.5;
    }
    .filter{
        width: fit-content;
        display: flex;
        gap: 2px;
        justify-content: space-between;
    }
    .filter button{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;
        background-color: transparent;
        border-radius: 5px;
        border: none;
    }
    #searchbar{
        display: flex;
        width:fit-content;
        align-items: center;
        height: 25px;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 0.2rem;
        padding-right: 0;
        background: white;
    }
    #searchbar input{
        flex: 1;
        max-width: 100px;
        border: none;
        outline: none;
        font-size: 0.8rem;
        background: transparent;
    }
    #close{
        width: 20px;
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
    button:disabled,
    button:hover{
        background-color: var(--vt-c-divider-dark-2);
        border-radius: 5px;
        border: 2px solid black;
    }
</style>