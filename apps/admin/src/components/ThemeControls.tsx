'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface ThemeControlsProps {
  pageId: string;
  theme?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
    headerStyle: string;
  };
  onUpdate: () => void;
}

const FONT_OPTIONS = [
  'system-ui, sans-serif',
  'Georgia, serif',
  'Helvetica Neue, sans-serif',
  'Inter, sans-serif',
  'Roboto, sans-serif',
];

const HEADER_STYLES = ['centered', 'left-aligned', 'full-width'];

export function ThemeControls({ pageId, theme, onUpdate }: ThemeControlsProps) {
  const [primaryColor, setPrimaryColor] = useState(theme?.primaryColor || '#1a1a2e');
  const [secondaryColor, setSecondaryColor] = useState(theme?.secondaryColor || '#e2e2e2');
  const [fontFamily, setFontFamily] = useState(theme?.fontFamily || 'system-ui, sans-serif');
  const [headerStyle, setHeaderStyle] = useState(theme?.headerStyle || 'centered');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await api.updatePage(pageId, {
        theme: {
          primaryColor,
          secondaryColor,
          fontFamily,
          headerStyle,
        },
      });
      onUpdate();
    } catch (err: any) {
      alert(`Failed to save theme: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <h3>Theme Customization</h3>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Primary Color</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="color"
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            style={{ width: '48px', height: '36px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
          />
          <input
            value={primaryColor}
            onChange={(e) => setPrimaryColor(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Secondary Color</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="color"
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            style={{ width: '48px', height: '36px', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
          />
          <input
            value={secondaryColor}
            onChange={(e) => setSecondaryColor(e.target.value)}
            style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'monospace' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Font Family</label>
        <select
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', width: '100%' }}
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>{font.split(',')[0]}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Header Style</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {HEADER_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => setHeaderStyle(style)}
              style={{
                padding: '6px 12px',
                border: headerStyle === style ? '2px solid #1a1a2e' : '1px solid #ddd',
                borderRadius: '4px',
                background: headerStyle === style ? '#f0f0ff' : '#fff',
                cursor: 'pointer',
                fontSize: '0.85rem',
              }}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', background: '#f8f9fa', borderRadius: '8px', marginBottom: '16px' }}>
        <p style={{ margin: '0 0 8px', fontWeight: '500', fontSize: '0.85rem', color: '#666' }}>Preview</p>
        <div style={{ padding: '16px', background: '#fff', borderRadius: '4px', fontFamily }}>
          <div style={{ background: primaryColor, color: '#fff', padding: '12px', borderRadius: '4px', textAlign: headerStyle === 'centered' ? 'center' : 'left', marginBottom: '8px' }}>
            Header Preview
          </div>
          <div style={{ background: secondaryColor, padding: '12px', borderRadius: '4px' }}>
            Content Area
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{ padding: '8px 24px', background: '#1a1a2e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {saving ? 'Saving...' : 'Save Theme'}
      </button>
    </div>
  );
}
