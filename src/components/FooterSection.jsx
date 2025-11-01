import React from "react";
import { motion } from "framer-motion";

const FooterSection = ({ data }) => {
  return (
    <motion.footer
      className="py-8 bg-gray-100 text-center text-gray-600"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <p>{data?.text || "© 2025 ProtoAI. Built by Uday."}</p>
    </motion.footer>
  );
};

export default FooterSection;
