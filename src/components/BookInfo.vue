<script setup>
import { ref, watch } from 'vue'
import Rating from "@/components/Rating.vue"
import { useReadingListStore } from '@/stores/readingList'
const store=useReadingListStore()
const { index } = defineProps({
    index: Number
})

const book = ref(null)
const editing=ref(false)

watch(() => index,(newIndex) => {
    if (newIndex >= 0 && store.books[newIndex]) {
        book.value = JSON.parse(JSON.stringify(store.books[newIndex]))
    } else {
        book.value = null
    }
},{ immediate: true })


function editTag(text,tags,i){
    if(text===''){
        tags.splice(i,1)
        book.value.categories.splice(i,1)
    }
    else tags[i]=text
}
function addTag(){
    if(store.books[index].categories){
        store.books[index].categories.push('Tag')
        book.value.categories.push('Tag')
    }
    else {
        console.log('test')
        store.books[index].categories=['Tag']
        book.value.categories=['Tag']
    }
}
</script>

<template>
    <div class="book" v-if="index!=-1">
        <div class="top">
            <div class="thumbnail">
                <img v-if="store.books[index].imageLinks?.thumbnail" :src="store.books[index].imageLinks.thumbnail" :alt="store.books[index].title + 'image'">
            </div>
            <div class="status-section">
                <select name="status" id="status" v-model="store.books[index].status">
                    <option value="To Read">To Read</option>
                    <option value="Important">Important</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                </select>
                <div class="buttons">
                    <button class="remove" @click="store.removeBook(index)">Remove Book</button>
                    <button @click="editing=!editing" :class="{'editing': editing}"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#1f1f1f"><path d="M216-216h51l375-375-51-51-375 375v51Zm-72 72v-153l498-498q11-11 23.84-16 12.83-5 27-5 14.16 0 27.16 5t24 16l51 51q11 11 16 24t5 26.54q0 14.45-5.02 27.54T795-642L297-144H144Zm600-549-51-51 51 51Zm-127.95 76.95L591-642l51 51-25.95-25.05Z"/></svg></button>
                </div>
                <Rating v-model="store.books[index].rating"></Rating>
            </div>

            <div spellcheck="false" class="details">
                <div :contenteditable="editing" @input="store.books[index].title = $event.target.textContent" :class="{'editable':editing}" class="title">{{book.title}}</div>
                <div :contenteditable="editing" @input="store.books[index].authors = $event.target.textContent.split(', ')" :class="{'editable':editing}" class="author">{{book.authors.slice(0, 3).join(', ')}}</div>
                Published: <span :contenteditable="editing" @input="store.books[index].publishedDate = $event.target.textContent" :class="{'editable':editing}">{{book.publishedDate}}</span> - <span :contenteditable="editing" @input="store.books[index].pageCount = $event.target.textContent" :class="{'editable':editing}">{{book.pageCount}}</span> pages
                
                <div class="tags">
                    <span v-for="(tag,i) in book.categories" :key="tag" :contenteditable="editing" @input="editTag($event.target.textContent, store.books[index].categories,i)" :class="{'editable':editing}" class="tag">{{tag}}</span>
                    <button v-if="editing" @click="addTag()" class="add">
                        <svg id="plus-add-more-detail" style="enable-background:new 0 0 15 15;" version="1.1" viewBox="0 0 15 15" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M7.5,0C3.364,0,0,3.364,0,7.5S3.364,15,7.5,15S15,11.636,15,7.5S11.636,0,7.5,0z M7.5,14C3.916,14,1,11.084,1,7.5  S3.916,1,7.5,1S14,3.916,14,7.5S11.084,14,7.5,14z"/><polygon points="8,3.5 7,3.5 7,7 3.5,7 3.5,8 7,8 7,11.5 8,11.5 8,8 11.5,8 11.5,7 8,7 "/></svg>
                    </button>
                </div>
            </div>
            <p :contenteditable="editing" @input="store.books[index].description = $event.target.textContent" spellcheck="false" :class="{'editable':editing}" class="description">{{book.description}}</p>
        </div>
        
        <textarea
            v-model="store.books[index].notes"
            placeholder="Add Notes..."
        ></textarea>
    </div>
    <div class="default" v-else>
        <svg class="info-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V13" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 6C2.75 7.67 2 9.75 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C10.57 2 9.2 2.3 7.97 2.85" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M11.9941 16H12.0031" stroke="#292D32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <h1>Select A Book For Information</h1>
        <p>This is a reading list, I made to keep track of my personal reading, other sites are often to cluttered, and I just wanted     something simple. It was also a great way to learn vue and improve my web development skills. Hope you enjoy! :)
            
        </p>
    </div>

</template>

<style scoped>
    .book{
        padding: 4px;
        width: 100%;
        height: 100%;
        font-family: sans-serif;
        position: relative;
        
    }
    .top{
        display:flow-root
    }
    .thumnail{
        max-width: 50%;
        float: right;
        margin-left: 20px;
        margin-bottom: 5px;
    }
    .status-section {
        width:40%;
        min-width: 135px;
        margin:30px 0;
        padding: 10px;
        display: flex;
        gap: 2px;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        justify-content: center;
    }
    #status{
        width: 100%;
        border: 2px solid rgb(70, 70, 70);
        border-radius: 5px;
    }
    .buttons{
        width: 100%;
        display: flex;
        gap: 2px;
    }
    .remove{
        justify-content: left;
        flex:1;
    }
    button{
        padding: 0 2px;
        height: 25px;
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgb(70, 70, 70);
        border-radius: 5px;
    }
    .editing{
        border-color: rgb(0, 202, 0);
    }
    .editable{
        border: 1px solid blue;
    }
  
    .add{
        padding: 0;
        border: none;
        border-radius: 50%;
        background: transparent;
        width: 20px;
        height: 20px;
    }
    .add:hover{
        background-color: rgba(60, 60, 60, 0.29);
    }
    .title {
        max-height: 50px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; 
        line-clamp: 2;
        word-break: break-word;
        overflow: hidden;
        margin: 0;
        margin-bottom: 2px;
        font-size: 1.1rem;
        font-weight: bold;
    }

    .author{
        max-height: 50px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; 
        line-clamp: 2;
        word-break: break-word;
        overflow: hidden;
        font-size: 1rem;
        font-weight: 500;
    }
    .details {
        text-align: left;
        font-size: 0.8rem;
        margin: 2px 0;
        color: #444;
    }

    .tags {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 6px;
    }

    .tag {
        background: #ddd;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 0.8rem;
    }
    .description{
        clear: both;
        padding: 0;
        max-height: 190px;
        overflow-y: scroll;
    }
    textarea {
        position: absolute;
        bottom: 5px;
        left: 0;
        width: 100%;
        height: 30px;
        resize: none;
        z-index: 10;
        background-color: white;
        border: 1px solid #ccc;
        padding: 6px;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    textarea:focus{
        height: 220px;
    }
    .default{
        text-align: center;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    .info-icon{
        width: 150px;
        height: 150px;
    }
    img{
        float: right;
        height: 250px;
        width: auto;
        max-width: 170px;
        border-radius: 8px;
        object-fit: cover;
    }
</style>