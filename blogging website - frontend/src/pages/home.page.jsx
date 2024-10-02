import AnimationWraper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";

const HomePage = () => {
    return (
        <AnimationWraper>
            <section className="h-cover flex justify-center gap-10 ">
                {/* this div will be for the latest blogs */}
                <div className="w-full">
                    {/* the routes will be displayed on screen , and on the other hand the defaultHidden is which will be hidden in larger screens */}
                    <InPageNavigation routes={["home" , "trending blogs"]} defaultHidden={["trending blogs"]}>
                       
                        <h1>Latest Blogs lol hahaha </h1>

                        <h1>Trending Blogs here </h1>

                    </InPageNavigation>
                </div>

                {/* filters and trending blogs */}
                <div>
                     
                </div>
            </section>
        </AnimationWraper>
    )
}

export default HomePage; 