import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"

const BentoGrid = ({ children, className }) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[16rem] md:auto-rows-[22rem] grid-cols-1 md:grid-cols-3 gap-6",
        className
      )}
    >
      {children}
    </div>
  )
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  onClick,
}) => (
  <motion.div
    key={name}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    onClick={onClick}
    className={cn(
      "group relative col-span-1 flex flex-col justify-between overflow-hidden rounded-[2.5rem] cursor-pointer",
      "bg-[#0A0A0A] border border-cyan-500/10 transform-gpu",
      "hover:border-cyan-500/30 transition-all duration-500",
      className
    )}
  >
    <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
      {background}
    </div>
    
    <div className="relative z-10 p-8 flex flex-col justify-between h-full bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent">
      <div className="pointer-events-none flex transform-gpu flex-col gap-2 transition-all duration-500 lg:group-hover:-translate-y-12">
        <div className="w-16 h-16 bg-cyan-500/5 rounded-2xl flex items-center justify-center mb-4 border border-cyan-500/10 group-hover:border-cyan-500/40 transition-all">
          <Icon className="h-8 w-8 origin-left transform-gpu text-cyan-400 drop-shadow-[0_0_10px_#22d3ee] transition-all duration-500 ease-in-out group-hover:scale-90" />
        </div>
        <h3 className="text-2xl font-black text-white tracking-tighter transition-all">
          {name}
        </h3>
        <p className="max-w-[200px] text-gray-500 text-sm font-medium leading-relaxed group-hover:text-gray-400 transition-all">
          {description}
        </p>
      </div>

      <div className="pointer-events-none flex w-full translate-y-10 items-center opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 mt-4">
        <a 
          href={href} 
          className="pointer-events-auto flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-widest hover:text-cyan-300 transition-colors"
        >
          {cta}
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>

    {/* Hover highlight effect */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-500 group-hover:bg-cyan-500/[0.03]" />
  </motion.div>
)

export { BentoCard, BentoGrid }
