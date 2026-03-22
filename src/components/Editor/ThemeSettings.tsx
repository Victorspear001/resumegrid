import { useResumeStore } from '../../store/useResumeStore';

export function ThemeSettings() {
  const { data, updateTheme } = useResumeStore();
  const { theme } = data;

  const colors = [
    { name: 'Blue', value: '#1e40af' },
    { name: 'Emerald', value: '#065f46' },
    { name: 'Violet', value: '#5b21b6' },
    { name: 'Rose', value: '#9f1239' },
    { name: 'Slate', value: '#334155' },
    { name: 'Black', value: '#000000' },
  ];

  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Playfair Display', value: '"Playfair Display", serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  ];

  const textColors = [
    { name: 'Dark Gray', value: '#1f2937' },
    { name: 'Black', value: '#000000' },
    { name: 'Gray', value: '#4b5563' },
    { name: 'Blue Gray', value: '#334155' },
    { name: 'Deep Blue', value: '#1e3a8a' },
  ];

  return (
    <section id="theme-settings" className="space-y-6 bg-[#050505] p-6 rounded-lg border border-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
      <div className="border-b border-gray-800 pb-4">
        <h3 className="text-xl font-bold text-gray-200 neon-text-purple">Design Settings</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Accent Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateTheme({ accentColor: color.value })}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  theme.accentColor === color.value ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Text Color</label>
          <div className="flex flex-wrap gap-2">
            {textColors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateTheme({ textColor: color.value })}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  theme.textColor === color.value ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            <input 
              type="color" 
              value={theme.textColor} 
              onChange={(e) => updateTheme({ textColor: e.target.value })}
              className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer p-0 overflow-hidden"
              title="Custom Color"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Heading Color</label>
          <div className="flex flex-wrap gap-2">
            {textColors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateTheme({ headingColor: color.value })}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                  theme.headingColor === color.value ? 'border-white scale-110 shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
            <input 
              type="color" 
              value={theme.headingColor} 
              onChange={(e) => updateTheme({ headingColor: e.target.value })}
              className="w-8 h-8 rounded-full bg-transparent border-none cursor-pointer p-0 overflow-hidden"
              title="Custom Color"
            />
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Spacing</label>
          <div className="flex gap-2">
            {(['compact', 'normal', 'spacious'] as const).map((spacing) => (
              <button
                key={spacing}
                onClick={() => updateTheme({ spacing })}
                className={`px-3 py-1.5 text-[10px] font-bold rounded-md capitalize border transition-all duration-300 ${
                  theme.spacing === spacing 
                    ? 'bg-neon-purple/10 border-neon-purple/50 text-neon-purple shadow-[0_0_5px_rgba(138,43,226,0.1)]' 
                    : 'bg-[#0a0a0a] border-gray-800 text-gray-600 hover:text-gray-400 hover:border-gray-700'
                }`}
              >
                {spacing}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Body Font</label>
          <select
            value={theme.fontFamily}
            onChange={(e) => updateTheme({ fontFamily: e.target.value })}
            className="w-full px-4 py-2 bg-[#050505] border border-gray-800 rounded-md text-gray-300 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple transition-all duration-300 text-sm"
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value} className="bg-[#050505] text-gray-300">{font.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
            <span>Heading Font</span>
          </label>
          <select
            value={theme.headingFontFamily}
            onChange={(e) => updateTheme({ headingFontFamily: e.target.value })}
            className="w-full px-4 py-2 bg-[#050505] border border-gray-800 rounded-md text-gray-300 focus:outline-none focus:ring-1 focus:ring-neon-purple focus:border-neon-purple transition-all duration-300 text-sm"
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value} className="bg-[#050505] text-gray-300">{font.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
            <span>Margin (mm)</span>
            <span className="text-neon-purple">{theme.margin}mm</span>
          </label>
          <input
            type="range"
            min="4"
            max="40"
            step="1"
            value={theme.margin}
            onChange={(e) => updateTheme({ margin: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-purple"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex justify-between">
            <span>Line Height</span>
            <span className="text-neon-purple">{theme.lineHeight}</span>
          </label>
          <input
            type="range"
            min="1"
            max="2"
            step="0.1"
            value={theme.lineHeight}
            onChange={(e) => updateTheme({ lineHeight: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-neon-purple"
          />
        </div>
      </div>
    </section>
  );
}
