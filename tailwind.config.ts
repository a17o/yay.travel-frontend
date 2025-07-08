import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'montserrat': ['Montserrat', 'sans-serif'],
				'karla': ['Karla', 'sans-serif'],
				lilita: ["'Lilita One'", 'cursive'],
			},
			fontSize: {
				'base': '1rem',    // 16px
				'lg': '1.125rem',  // 18px
				'xl': '1.25rem',   // 20px
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				travel: {
					blue: '#3b82f6',
					navy: '#1e40af',
					gray: '#f8fafc',
					text: '#1f2937',
					link: '#3b82f6',
					accent: '#f59e0b'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'pulse': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.5'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			},
			spacing: {
				// 8-point grid system
				'1': '4px',    // 4px
				'2': '8px',    // 8px
				'3': '12px',   // 12px
				'4': '16px',   // 16px
				'5': '20px',   // 20px
				'6': '24px',   // 24px
				'7': '28px',   // 28px
				'8': '32px',   // 32px
				'9': '36px',   // 36px
				'10': '40px',  // 40px
				'11': '44px',  // 44px
				'12': '48px',  // 48px
				'13': '52px',  // 52px
				'14': '56px',  // 56px
				'15': '60px',  // 60px
				'16': '64px',  // 64px
				'18': '72px',  // 72px
				'20': '80px',  // 80px
				'24': '96px',  // 96px
				'28': '112px', // 112px
				'32': '128px', // 128px
				'36': '144px', // 144px
				'40': '160px', // 160px
				'44': '176px', // 176px
				'48': '192px', // 192px
				'52': '208px', // 208px
				'56': '224px', // 224px
				'60': '240px', // 240px
				'64': '256px', // 256px
				'72': '288px', // 288px
				'80': '320px', // 320px
				'96': '384px', // 384px
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
