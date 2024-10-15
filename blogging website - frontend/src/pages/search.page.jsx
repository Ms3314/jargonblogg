import { useParams } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"
import { useEffect, useState } from "react"
import AnimationWraper from "../common/page-animation"
import BlogPostCard from "../components/blog-post.component"
import NoDataMessage from "../components/nodata.component"
import LoadMoreDataBtn from "../components/load-more.component"
import { filterPaginationData } from "../common/filter-pagination-data"
import Loader from "../components/loader.component"
import axios from "axios"


function SearchPage() {
  let { query } = useParams();
  let [blog, setBlog] = useState(null);

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

  useEffect(() => {
      resetState();
      searchBlog({ page: 1, create_new_arr: true });
  }, [query]);

  const resetState = () => {
      setBlog(null);
  };

  return (
      <div>
          <section className="h-cover justify-center gap-10">
              <div className="w-full">
                  <InPageNavigation
                      routes={[`Search Results from "${query}"`, "Accounts Matched"]}
                      defaultHidden={["Accounts Matched"]}
                  >
                    {/* bhai ye wala inPageNav bhot dimag kharan fn hai , kaise kaam karta ki magar isko array hona hai , eill uodate later if i understood this , iska maslam hai ki ak item ku ich render karta zada samjh nai ara bhul gaya will return to it later  */}
                      {[
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
                          ),
                          <div> {/* Placeholder for the second tab (Accounts Matched) */}
                              {/* Content for "Accounts Matched" tab can be added here */}
                              <NoDataMessage message="No Accounts matched" />
                          </div>
                      ]}
                  </InPageNavigation>
                  <LoadMoreDataBtn state={blog} fetchDataFn={searchBlog} />
              </div>
          </section>
      </div>
  );
}

export default SearchPage;
