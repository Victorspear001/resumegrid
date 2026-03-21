import { useResumeStore } from '../../store/useResumeStore';

export function ThemeSettings() {
  const { data, updateTheme } = useResumeStore();
  const { theme } = data;

  const colors = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Emerald', value: '#059669' },
    { name: 'Violet', value: '#7c3aed' },
    { name: 'Rose', value: '#e11d48' },
    { name: 'Slate', value: '#475569' },
    { name: 'Black', value: '#000000' },
  ];

  const fonts = [
    { name: 'Inter', value: 'Inter, sans-serif' },
    { name: 'Roboto', value: 'Roboto, sans-serif' },
    { name: 'Playfair Display', value: '"Playfair Display", serif' },
    { name: 'Merriweather', value: 'Merriweather, serif' },
    { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  ];

  return (
    <section id="theme-settings" className="space-y-6 bg-gray-50 p-6 rounded-lg border border-gray-200">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-xl font-semibold text-gray-900">Design Settings</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Accent Color</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => updateTheme({ accentColor: color.value })}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                  theme.accentColor === color.value ? 'border-gray-900 scale-110' : 'border-transparent'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Spacing</label>
          <div className="flex gap-2">
            {(['compact', 'normal', 'spacious'] as const).map((spacing) => (
              <button
                key={spacing}
                onClick={() => updateTheme({ spacing })}
                className={`px-3 py-1.5 text-sm rounded-md capitalize border transition-colors ${
                  theme.spacing === spacing 
                    ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {spacing}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Body Font</label>
          <select
            value={theme.fontFamily}
            onChange={(e) => updateTheme({ fontFamily: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value}>{font.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">Heading Font</label>
          <select
            value={theme.headingFontFamily}
            onChange={(e) => updateTheme({ headingFontFamily: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {fonts.map((font) => (
              <option key={font.value} value={font.value}>{font.name}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
