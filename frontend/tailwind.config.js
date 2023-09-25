/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend:{
      fontFamily: {
        poppins: "'Poppins', serif"
      },
    }
  },
  daisyui: {
    themes: [
      {
        'aeon': {
           'primary' : '#ad2181',
           'primary-focus' : '#c0268f',
           'primary-content' : '#ffffff',

           'secondary' : '#74788d',
           'secondary-focus' : '#8388a0',
           'secondary-content' : '#ffffff',

           'accent' : '#37cdbe',
           'accent-focus' : '#2ba69a',
           'accent-content' : '#ffffff',

           'neutral' : '#3b424e',
           'neutral-focus' : '#2a2e37',
           'neutral-content' : '#ffffff',

           'base-100' : '#ffffff',
           'base-200' : '#f9fafb',
           'base-300' : '#ced3d9',
           'base-content' : '#1e2734',

           'info' : '#50a5f1',
           'success' : '#34c38f',
           'warning' : '#f1b44b',
           'error' : '#f46a6a',

          '--rounded-box': '1rem',          
          '--rounded-btn': '0.5rem',        
          '--rounded-badge': '1.9rem',      

          '--animation-btn': '0.25s',       
          '--animation-input': '0.2s',       

          '--btn-text-case': 'uppercase',   
          '--navbar-padding': '0.5rem',      
          '--border-btn': '1px',            
        },
      },
    ],
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require("daisyui")
  ],
}

