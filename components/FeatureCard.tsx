import React from "react";
import { motion } from "framer-motion";
import Card from "./Card";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  delay?: number;
};

const FeatureCard = ({
  title,
  description,
  icon: Icon,
  gradient,
  delay = 0,
}: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    viewport={{ once: true }}
  >
    <Card className="p-8 text-center group cursor-pointer">
      <motion.div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br ${gradient}`}
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.8 }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.div>
      <h3 className="font-semibold text-slate-100 mb-3 text-xl">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </Card>
  </motion.div>
);

export default FeatureCard;
