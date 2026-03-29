import { useState } from "react";
import { motion } from "motion/react";
import { sectionVariants } from "@/lib/animations";
import MagneticButton from "./MagneticButton";

const formatCurrency = (val: number) =>
  "₹" + val.toLocaleString("en-IN");

const ROICalculator = () => {
  const [patientsPerDay, setPatientsPerDay] = useState(20);
  const [noShowRate, setNoShowRate] = useState(25);
  const [avgValue, setAvgValue] = useState(800);

  const monthlyPatients = patientsPerDay * 30;
  const monthlyNoShows = Math.round((monthlyPatients * noShowRate) / 100);
  const revenueLost = monthlyNoShows * avgValue;
  const recovered = Math.round(revenueLost * 0.9);
  const nikaiCost = 4999; // assumed monthly cost
  const paybackDays = recovered > 0 ? Math.max(1, Math.round((nikaiCost / (recovered / 30)))) : 0;

  return (
    <section
      id="roi-calculator"
      className="py-12 sm:py-24 px-4 sm:px-6 relative overflow-hidden bg-white border-t border-[rgba(156,111,228,0.08)] z-10"
    >
      <div className="mx-auto max-w-[1200px] relative z-10">
        <motion.div
          className="text-center mb-16"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="font-['Geist'] text-[clamp(28px,5vw,48px)] font-semibold text-[#0D0D1F] mb-4">
            Calculate your clinic's monthly loss
          </h2>
          <p className="text-[#4A4A6A] text-lg max-w-xl mx-auto">
            See exactly how much operational inefficiency is costing you.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 gap-12 items-start"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Sliders */}
          <div className="flex flex-col gap-10">
            <SliderInput
              label="Patients per day"
              min={5}
              max={100}
              value={patientsPerDay}
              onChange={setPatientsPerDay}
              display={String(patientsPerDay)}
            />
            <SliderInput
              label="No-show rate %"
              min={5}
              max={40}
              value={noShowRate}
              onChange={setNoShowRate}
              display={`${noShowRate}%`}
            />
            <SliderInput
              label="Average appointment value"
              min={200}
              max={5000}
              step={100}
              value={avgValue}
              onChange={setAvgValue}
              display={formatCurrency(avgValue)}
            />
          </div>

          {/* Results */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-4">
              <ResultBox label="Monthly no-shows" value={`${monthlyNoShows} patients`} />
              <ResultBox label="Revenue lost monthly" value={formatCurrency(revenueLost)} />
              <ResultBox
                label="With NikAI (90% reduction)"
                value={`You recover ${formatCurrency(recovered)}/mo`}
                highlight
              />
              <ResultBox label="NikAI pays for itself in" value={`${paybackDays} days`} />
            </div>

            {/* Big result card */}
            <div className="rounded-2xl p-8 text-center border border-[rgba(224,64,251,0.2)] relative overflow-hidden"
              style={{ background: "linear-gradient(135deg, rgba(224,64,251,0.04), rgba(156,111,228,0.06))" }}
            >
              <p className="text-[13px] text-[#4A4A6A] mb-2 uppercase tracking-widest font-medium">
                You're losing
              </p>
              <p className="font-['Syne'] text-[clamp(28px,5vw,36px)] font-bold text-[#E040FB] leading-tight mb-2">
                {formatCurrency(revenueLost)}
              </p>
              <p className="text-[13px] text-[#4A4A6A] uppercase tracking-widest font-medium">
                every month
              </p>
              <p className="text-sm text-[#4A4A6A] mt-4">
                NikAI recovers most of it automatically.
              </p>
            </div>

            <MagneticButton>
              <a
                href="#demo"
                className="w-full rounded-full bg-gradient-to-r from-[#E040FB] to-[#9C6FE4] px-8 py-4 text-sm font-semibold text-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center min-h-[44px]"
              >
                See how NikAI does it →
              </a>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const SliderInput = ({
  label,
  min,
  max,
  value,
  onChange,
  display,
  step = 1,
}: {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  display: string;
  step?: number;
}) => {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[13px] text-[#4A4A6A] font-medium">{label}</span>
        <span className="text-[14px] font-bold text-[#0D0D1F]">{display}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="roi-slider w-full"
          style={{
            background: `linear-gradient(to right, #E040FB 0%, #9C6FE4 ${percent}%, rgba(224,64,251,0.15) ${percent}%)`,
          }}
        />
      </div>
    </div>
  );
};

const ResultBox = ({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-xl p-4 border ${
      highlight
        ? "border-[rgba(224,64,251,0.3)] bg-[rgba(224,64,251,0.04)]"
        : "border-[rgba(156,111,228,0.12)] bg-white"
    }`}
  >
    <p className="text-[11px] text-[#4A4A6A] uppercase tracking-wider mb-1 font-medium">{label}</p>
    <p className={`text-[15px] font-bold ${highlight ? "text-[#E040FB]" : "text-[#0D0D1F]"}`}>{value}</p>
  </div>
);

export default ROICalculator;
