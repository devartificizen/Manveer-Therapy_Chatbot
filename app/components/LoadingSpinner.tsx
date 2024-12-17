import { motion } from 'framer-motion';
import { BsFlower1 } from 'react-icons/bs';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <BsFlower1 size={40} className="text-white" />
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;
