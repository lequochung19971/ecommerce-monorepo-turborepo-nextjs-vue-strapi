/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './node_modules/primevue/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        'gray-f8f': '#f8f9fa',
        'gray-e5e': '#e5e7eb'
      }
    }
  },
  plugins: [
    /** @type {import('tailwindcss/types/config').PluginCreator} */
    ({ addUtilities }) => {
      addUtilities({
        '.border-default': {
          '@apply border border-solid border-[#dee2e6]': {}
        },
        '.border-default-l': {
          '@apply border-l border-solid border-[#dee2e6]': {}
        },
        '.border-default-r': {
          '@apply border-r border-solid border-[#dee2e6]': {}
        },
        '.border-default-t': {
          '@apply border-t border-solid border-[#dee2e6]': {}
        },
        '.border-default-b': {
          '@apply border-b border-solid border-[#dee2e6]': {}
        }
      })
    }
  ]
}
