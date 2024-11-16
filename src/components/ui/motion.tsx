import { HTMLMotionProps, motion } from "framer-motion"

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const slideIn = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 20, opacity: 0 },
}

export const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
}

export const MotionDiv = motion.div
export const MotionSection = motion.section

export interface AnimatedCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode
}

export function AnimatedCard({ children, ...props }: AnimatedCardProps) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

export function AnimatedSection({ children, ...props }: AnimatedCardProps) {
  return (
    <MotionSection
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </MotionSection>
  )
}