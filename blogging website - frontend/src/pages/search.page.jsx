import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"

function SearchPage() {
    let {query} = useParams()
  return (
    <div>
        <section className='h-cover justify-center gap-10 ' >
            <div className="w-full">
                <InPageNavigation routes={[`Search Results from "${query}"` , "Accounts Matched"]} defaultHidden={["Accounts Matched"]}>
                    <>
                    </>
                </InPageNavigation>
            </div>
        </section>
    </div>
  )
}

export default SearchPage
