const LoadMoreDataBtn = ({state , fetchDataFn}) => {
    // so how things work is like as load is clickes more 
    if (state != null && state.totalDocs > state.results.length)
    return (
        <button 
        // on fetching this data the only thing we do it adding more data to the existing data ... check the demo to undertand better 
        onClick={()=> fetchDataFn({page : state.page+1})}
        className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
        >   
            Load More
        </button>
    )
}

export default LoadMoreDataBtn