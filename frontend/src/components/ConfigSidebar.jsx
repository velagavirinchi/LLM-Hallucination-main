import React from 'react';
import { Settings2, Layers, Thermometer, Hash, Zap, RotateCcw } from 'lucide-react';

export default function ConfigSidebar({ config, setConfig }) {
  
  const DEFAULT_CONFIG = {
    temperature: 0.7,
    top_k: 50,
    top_p: 0.9,
    num_generations: 3
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const renderSlider = (icon, label, name, min, max, step, displayVal) => (
    <div className="mb-6 animate-slide-up">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-sm text-text-primary font-medium">
          {icon}
          {label}
        </div>
        <span className="text-xs bg-border-color/20 px-2 py-1 rounded font-mono text-primary">
          {displayVal}
        </span>
      </div>
      <input 
        type="range" 
        name={name}
        min={min} 
        max={max} 
        step={step}
        value={config[name]}
        onChange={handleChange}
        className="w-full h-1 bg-border-color/30 rounded-lg appearance-none cursor-pointer accent-primary"
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-card/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-text-secondary text-sm font-semibold uppercase tracking-wider">
          <Settings2 size={16} />
          Parameters
        </div>
        <button 
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold uppercase tracking-tighter text-text-secondary hover:text-primary transition-colors border border-border-color rounded-md hover:border-primary/30"
          title="Reset to defaults"
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      {renderSlider(<Thermometer size={16}/>, "Temperature", "temperature", 0.1, 2.0, 0.1, config.temperature)}
      {renderSlider(<Hash size={16}/>, "Top K", "top_k", 1, 100, 1, config.top_k)}
      {renderSlider(<Zap size={16}/>, "Top P", "top_p", 0.1, 1.0, 0.05, config.top_p)}
      
      <div className="my-4 border-t border-border-color"></div>
      
      <div className="flex items-center gap-2 mb-6 text-text-secondary text-sm font-semibold uppercase tracking-wider">
        <Layers size={16} />
        Internal States
      </div>
      
      {renderSlider(<Hash size={16}/>, "Generations Count", "num_generations", 2, 10, 1, config.num_generations)}
      
      <div className="mt-auto pt-6">
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-xs text-primary leading-relaxed">
            Adjusting parameters affects model generation. <b>Generations Count</b> determines how many parallel responses are generated to compute <i>EigenScore</i> and <i>Entropy</i>.
          </p>
        </div>
      </div>
    </div>
  );
}
