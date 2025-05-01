<script setup>
  import { ref, computed } from 'vue'
  import BookSearch from "@/components/BookSearch.vue"
  import ReadingList from "@/components/ReadingList.vue"
  import BooksHeader from "@/components/BooksHeader.vue"
  import BookInfo from "@/components/BookInfo.vue"
  import { useReadingListStore } from '@/stores/readingList'
  const store=useReadingListStore()

  const currentIndex=ref(-1)
  const selectedTags = ref(['To Read', 'Done', 'Fiction', 'Non-Fiction'])
  const hiddenTags = ref(['','','',''])
  const view = ref('listView')
  const filterSearch= ref('')


  const tags=new Map([
    ['To Read',0],
    ['Done',1],
    ['Fiction',2],
    ['Non-Fiction',3],
  ])
  
  function updateHidden(tag){
    const index = tags.get(tag)
    if (hiddenTags.value[index] === tag){
      hiddenTags.value[index]=''
    }
    else{
      hiddenTags.value[index]=tag
      selectedTags.value[index]=''
    }
  }
  function updateTags(tag){
    const index = tags.get(tag)
    if (selectedTags.value[index] === tag){
      selectedTags.value[index]=''
    }
    else{
      selectedTags.value[index]=tag
      hiddenTags.value[index]=''
    }
  }

  const fiction=['Fiction','Caste','Dystopia','Science Fiction','Fantasy']
  const nonFiction=['Medical','Political Science','Business & Economics', 'Economics','History','Philosophy','Non-Fiction','Social Science','Psychology','Science']
  let filteredbooks=computed(() => {
    return store.books.filter(book => {
      //search filtering
      let found=false
      if(book.title.toUpperCase().includes(filterSearch.value))found=true
      else if(book.authors.some(author => author.toUpperCase().includes(filterSearch.value)))found=true
      if(!found)return false

      //tags filtering
      if(hiddenTags.value[0]=='To Read' && ['To Read', 'Important','In Progress'].includes(book.status))return false
      else if(hiddenTags.value[1]=='Done' && book.status=='Done')return false
      else if(hiddenTags.value[2]=='Fiction' && fiction.some(tag => book.categories?.includes(tag)))return false
      else if(hiddenTags.value[3]=='Non-Fiction' && nonFiction.some(tag => book.categories?.includes(tag)))return false
      else if(selectedTags.value[0]=='To Read' && ['To Read', 'Important','In Progress'].includes(book.status))return true
      else if(selectedTags.value[1]=='Done' && book.status=='Done')return true
      else if(selectedTags.value[2]=='Fiction' && fiction.some(tag => book.categories?.includes(tag)))return true
      else if(selectedTags.value[3]=='Non-Fiction' && nonFiction.some(tag => book.categories?.includes(tag)))return true
      else return false
    })
  })
</script>

<template>
  <main>  
    <div id="reading-list">
      <h1>Reading List
        
      </h1>
      <BookSearch @updateList="store.addBook"></BookSearch>
      <BooksHeader :selectedTags="selectedTags" :hiddenTags="hiddenTags" v-model:view="view" @searched="(e)=>filterSearch=e.toUpperCase()" @updateTags="updateTags" @updateHidden="updateHidden"></BooksHeader>
      <hr>
      <div id="sort-panel"></div>
      
      <ReadingList :view="view" :current="filteredbooks.indexOf(store.books[currentIndex])" :books="filteredbooks" @clickBook="(index) => currentIndex = store.books.indexOf(filteredbooks[index])"></ReadingList>
      
    </div>

    <div id="sidebar">
      <BookInfo :index="filteredbooks.includes(store.books[currentIndex]) ? currentIndex : -1"></BookInfo>
    </div>
  </main>
</template>

<style scoped>
  main{
    display: grid ;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(160px, 1fr) minmax(160px,1fr);
    gap: 20px;
  }
  #reading-list{
    height: 80vh;
    padding: 10px;
    border-radius: 10px;
    grid-column: 1 / 4;
    background-color: var(--vt-c-white-mute);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  #sort-panel{
    width: 100%;
    position: relative;
  }
  hr{
    margin: 2px 12px;
    width: calc(100% - 24px);
    height: 4px;
    background-color: black;
  }
  #sidebar{
    height: 80vh;
    padding: 10px;
    border-radius: 10px;
    grid-column: 4/6;
    background-color: var(--vt-c-white-mute);
  }
  @media screen and (max-width: 800px) {
    main{
      display: flex;
      flex-direction: column;
    }
    #reading-list {
      width: 100%;
    }
  }
  
</style>