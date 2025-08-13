<script setup>
    import { ref, watch} from 'vue'

    const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
    defineProps(['readingList'])
    const emit = defineEmits(['updateList'])

    let searchQuery = ref('')
    const books = ref([]);
    const isVisible = ref(false);
    const modalContent = ref(null)

    let debounceTimeout
    watch(searchQuery, (newQuery) => {
        clearTimeout(debounceTimeout)
        if (newQuery.length<3) {
            books.value = []
            return
        }
        debounceTimeout = setTimeout(() => {
            searchBooks(newQuery)
        }, 300) // delay in ms
    })

    async function searchBooks(query) {
        try {
            const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`)
            const data = JSON.parse(res);   
            books.value = data.items|| []  
        } catch (err) {
            console.error("Fetch error:", err);
            books.value = [] 
        }
    }
    function updateList(book) {
        emit('updateList', book)
    }

    watch(books,(a)=>{
        if(a.length && !isVisible.value){
            open()
        }
        else if(!a.length && isVisible.value){
            close()
        }
    })
    const open = () => {
        isVisible.value = true
        document.addEventListener('mousedown', handleOutsideClick)
        document.addEventListener('keydown', handleKeyDown)
    }

    const close = () => {
        isVisible.value = false
        searchQuery.value=''
        document.removeEventListener('mousedown', handleOutsideClick)
        document.removeEventListener('keydown', handleKeyDown)
    }
    const handleOutsideClick = (event) => {
        if (modalContent.value && !modalContent.value.contains(event.target)) {
            close()
        }
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Escape') {
            close()
        }
    }
    

</script>

<template>
    <div class="container">

        <input 
            v-model="searchQuery"
            placeholder="Search..." 
            aria-label="Search">
        <div v-if="isVisible">
            <ul class="modal" ref="modalContent">
                <template v-for="(book,index) in books">
                    <li v-if="book.volumeInfo.authors">
                        <p class="book-info">
                            <div class="title">{{ book.volumeInfo.title }}</div>
                            <div class="author">{{ book.volumeInfo.authors.slice(0, 3).join(', ') }}</div>
                        </p>
                        <button @click="updateList(book.volumeInfo)">
                            <svg id="plus-add-more-detail" style="enable-background:new 0 0 15 15;" version="1.1" viewBox="0 0 15 15" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M7.5,0C3.364,0,0,3.364,0,7.5S3.364,15,7.5,15S15,11.636,15,7.5S11.636,0,7.5,0z M7.5,14C3.916,14,1,11.084,1,7.5  S3.916,1,7.5,1S14,3.916,14,7.5S11.084,14,7.5,14z"/><polygon points="8,3.5 7,3.5 7,7 3.5,7 3.5,8 7,8 7,11.5 8,11.5 8,8 11.5,8 11.5,7 8,7 "/></svg>
                        </button>
                    </li>
                    <hr v-if="book.volumeInfo.authors && index!==books.length-1">
                </template>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.container{
    position: relative;
    height: fit-content;
    max-height: 100%;
    width: 60%;
}
.modal{
    border: 2px solid var(--vt-c-black-soft);
    border-top: transparent;
    padding: 12px;
    position: absolute;
    top: 22px;
    left: 0;
    z-index: 5;
    width: 100%;
    height: 50vh;
    overflow-y: scroll;
    background-color: white;
}
li{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
hr{
    color: var(--vt-c-black-soft);
}
input{
    width: 100%;
    height: 20px;
}
.title{
    font-size: 0.9rem;
    line-height: 1.15;
    font-weight: 600;
}
.author{
    font-size: 0.8rem;
    margin-top: -5px;
}
button:hover{
    background-color: rgba(60, 60, 60, 0.29);
}
svg{
    width: 20px;
    height: 20px;
    display: block;
}
button {
    padding: 0;
    border: none;
    border-radius: 50%;
    background: transparent;
    width: 20px;
    height: 20px;
}
</style>