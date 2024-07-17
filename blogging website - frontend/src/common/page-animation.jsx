import {AnimatePresence ,  animate,  motion} from 'framer-motion';

const AnimationWraper = ({children , className , keyValue , transition={duration : 0.8} , initial = {opacity : 0 } , animate={opacity : 1}}) => {
    return (
        // i need to make a commit 
        <AnimatePresence>

        <motion.div
            key= {keyValue}
            initial={initial}
            animate={animate}
            transition={transition}
            className={className}
            >
            {children}
        </motion.div>
        
        </AnimatePresence>
    )
}

export default AnimationWraper