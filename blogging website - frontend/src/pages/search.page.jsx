import { Link, useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"
import { useEffect, useState } from "react"
import AnimationWraper from "../common/page-animation"
import BlogPostCard from "../components/blog-post.component"
import NoDataMessage from "../components/nodata.component"
import LoadMoreDataBtn from "../components/load-more.component"
import { filterPaginationData } from "../common/filter-pagination-data"
import Loader from "../components/loader.component"
import axios from "axios"
import UserCard from "../components/usercard.component"

function SearchPage() {
  let { query } = useParams();
  let [blog, setBlog] = useState(null);
  let [users , setUsers] = useState(null);


  const searchBlog = ({ page = 1, create_new_arr = false }) => {
      axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
          .then(async ({ data }) => {
              let formatedData = await filterPaginationData({
                  state: blog,
                  data: data.blogs,
                  page,
                  countRoute: "/search-blogs-count",
                  data_to_send: { query },
                  create_new_arr,
              });
              setBlog(formatedData);
          })
          .catch((err) => {
              console.log(err);
          });
  };

  const fetchUsers = () => {
    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users" , { query })
    .then(({data : {users}})=>{
        setUsers(users);
    })
    .catch((err)=>{
      console.log(err);
    })
  }

  const UserCardWrapper = () => {
    return (
        <>
            {
                 users == null ? <Loader/> :
                    users.length ? 
                        users.map((user,i)=>{
                            return (
                                <Link to={`/user/${user.username}`} key={i}>
                                <AnimationWraper key={i} transition={{duration : 1 , delay : i*0.08}}>
                                    <UserCard user={user}/>
                                </AnimationWraper>
                                </Link>
                            )
                        })
                    :
                    <NoDataMessage message="No user Found" />
            }
        </>
    )


    }

  useEffect(() => {
      resetState();
      searchBlog({ page: 1, create_new_arr: true });
      fetchUsers()
  }, [query]);

  const resetState = () => {
      setBlog(null);
      setUsers(null);
  };

  return (
      <div>
          <section className="flex flex-row h-cover justify-center gap-10">
              <div className="w-full">
                  <InPageNavigation
                      routes={[`Search Results from "${query}"`, "Accounts Matched"]}
                      defaultHidden={["Accounts Matched"]}
                  >
                    <>
                    {/* bhai ye wala inPageNav bhot dimag kharan fn hai , kaise kaam karta ki magar isko array hona hai , eill uodate later if i understood this , iska maslam hai ki ak item ku ich render karta zada samjh nai ara bhul gaya will return to it later  */}
                      {
                        blog == null ? (
                              <Loader />
                          ) : blog.results && blog.results.length ? (
                              blog.results.map((blog, i) => (
                                  <AnimationWraper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                                      <BlogPostCard content={blog} author={blog.author.personal_info} />
                                  </AnimationWraper>
                              ))
                          ) : (
                              <NoDataMessage message="No Blogs published" />
                          ) 
                        }  
                        <LoadMoreDataBtn state={blog} fetchDataFn={searchBlog} />
                    </>
                    <UserCardWrapper/>
                  </InPageNavigation>
              </div>

              {/* the right side panel for the users finding */}
              <div className="border-l-2  min-w-[40%] lg:min-w-[350px] max-w-min border-1 border-grey pl-8 pt-3 max-md:hidden " > 
                        <h1 className="font-medium text-xl mb-10" >User Related to Search <i className="fi mt-1 fi-rs-user"></i></h1>
                        <UserCardWrapper />
              </div>
          </section>
      </div>
  );
}

export default SearchPage;
