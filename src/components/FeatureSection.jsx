import React from "react";
import { motion } from "framer-motion";

const FeatureSection = ({ data }) => {
return ( <section className="py-16 text-center bg-gray-50 rounded-2xl">
<motion.h2
className="text-3xl font-bold mb-10 text-gray-800"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.6 }}
>
Key Features
</motion.h2>

```
  <div className="flex flex-wrap justify-center gap-6">
    {data.items.map((feature, index) => (
      <motion.div
        key={index}
        className="bg-white px-6 py-4 rounded-xl shadow hover:shadow-lg w-60"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2 }}
      >
        {feature}
      </motion.div>
    ))}
  </div>
</section>

);
};

export default FeatureSection;
