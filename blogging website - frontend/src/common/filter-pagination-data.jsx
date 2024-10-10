import axios from "axios";

export const filterPaginationData = async ({create_new_arr = false , state , data , page , countRoute , data_to_send = {}}) => {
        let obj;
        if (state != null && !create_new_arr) {
            //  in simple terms we are already have an array 
            // Safely check if state.results exists and is iterable
        obj = {
            ...state,
            // basically we keep on addin the data when we click on the button get it 
            results: state.results ? [...state.results, ...data] : [...data], // fallback if state.results doesn't exist
            page: page
        };

        } else {
            // if we dont have anything in the data structure 
            await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute , data_to_send)
            .then(({data : {totalDocs}}) => {
                // idar jo mere paas data hai woh mereku state se milra , mein neeche wale ki baat karrun 
                obj = { results : data , page : 1 , totalDocs }
            })
            .catch(err => {
                console.log(err.message);
            })
        }
        return obj;
}
