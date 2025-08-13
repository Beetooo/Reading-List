
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useReadingListStore = defineStore('readingList', () => {
  const books = ref([])
  const sort = ref('status')
  const sortTags = ref([])

  const stored = localStorage.getItem('readingList')
  if (stored) {
    try {
      books.value = JSON.parse(stored)
    } catch (e) {
      console.error('Failed to parse reading list from localStorage', e)
    }
  }

  watch(books, (newList) => {
    localStorage.setItem('readingList', JSON.stringify(newList))
  }, { deep: true })

  function addBook(book){
    if (!books.value.find(b => b.title === book.title)) {
      book.status="To Read"
      book.rating=0
      books.value.push(book)
    }
  }
  function removeBook(index) {
    books.value.splice(index,1)
  }
  watch([sort,sortTags], ([sort,sortTags])=>{
    if(sort==='rating'){
      books.value.sort((a, b) => b.rating - a.rating);
    }
    else if(sort==='status'){
      const order=new Map([['In Progress',0],['Important',1],['To Read',2],['Done',3]])
      books.value.sort((a, b) => {
        const aOrder = order.get(a.status);
        const bOrder = order.get(b.status);
        return aOrder - bOrder;
      });
    }
    else if(sort==='authorAlphabetical'){
      books.value.sort((a, b) => {
        const authorA = a.authors && a.authors[0] ? a.authors[0] : '';  
        const authorB = b.authors && b.authors[0] ? b.authors[0] : '';
        return authorA.localeCompare(authorB);
      });
    }
    else if(sort==='titleAlphabetical'){
      books.value.sort((a, b) => a.title.localeCompare(b.title));
    }

    if(sortTags && sortTags.length > 0) {
      const matchingBooks = [];
      const nonMatchingBooks = [];
      
      books.value.forEach(book => {
        if(book.categories && book.categories.some(tag => sortTags.includes(tag))) {
          matchingBooks.push(book);
        } else {
          nonMatchingBooks.push(book);
        }
      });
      books.value = [...matchingBooks, ...nonMatchingBooks];
    }
  }, { deep: true })

  return {
    sort,
    sortTags,
    books,
    addBook,
    removeBook,
  }
})