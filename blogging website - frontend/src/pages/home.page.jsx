import AnimationWraper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";

const HomePage = () => {
    return (
        <AnimationWraper>
            <section className="h-cover flex justify-center gap-10 ">
                {/* this div will be for the latest blogs */}
                <div className="w-full">
                    <InPageNavigation routes={["home" , "trending blogs"]}>
                        
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