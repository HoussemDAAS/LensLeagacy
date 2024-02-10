import { Models } from "appwrite"
import Loader from "./Loader";

import GridPostList from "./GridPostList";


type SearchResultProps = {
  isSearchFetching: boolean
  searchedPosts: Models.Document[];
}

const SearchResult = ({isSearchFetching, searchedPosts}:SearchResultProps) => {
  if (isSearchFetching) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader/>
      </div>
    )
  }
   // @ts-ignore
  if (searchedPosts && searchedPosts.documents.length >0) {
    return (
       // @ts-ignore
      <GridPostList posts={searchedPosts.documents} />
    )
    
  }
  return (
    <div className="flex justify-center items-center h-full">
    <h1 className="text-light-4 mt-10 text-center">No results found</h1>
  </div>
  )
}

export default SearchResult
