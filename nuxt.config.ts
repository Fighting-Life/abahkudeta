import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const isDev = process.env.NODE_ENV === "development";
const isProd = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const isLocalTunnel = isDev && !isVercel;

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: false },
	experimental: {
		typedPages: true,
		scanPageMeta: false,
		payloadExtraction: false,
		// renderJsonPayloads: false,
		pendingWhenIdle: true,
		alwaysRunFetchOnKeyChange: true,
	},
	modules: [
		"@nuxt/eslint",
		"@nuxt/icon",
		"@nuxt/image",
		"@nuxt/scripts",
		"@nuxtjs/color-mode",
		"@vueuse/nuxt",
		"@nuxtjs/robots",
		"@pinia/nuxt",
		"@vee-validate/nuxt",
		"shadcn-nuxt",
		"@nuxtjs/supabase",
		"@nuxtjs/sitemap",
		"nuxt-headlessui",
	],
	css: ["~/assets/css/tailwind.css", "~/assets/css/animations.css"],
	alias: {
		$lib: "./app/lib",
		$components: "./app/components",
	},
	components: [
		{
			path: "~/components", // Ini harus menunjuk ke directory yang ada
			pathPrefix: false,
			extensions: [".vue"],
		},
	],
	devServer: {
		host: "0.0.0.0",
		port: 3002,
	},
	vite: {
		build: {
			sourcemap: true,
			cssCodeSplit: true,
			rollupOptions: {
				output: {
					sourcemapExcludeSources: true,
					manualChunks: (id) => {
						if (id.includes("node_modules")) {
							if (id.includes("lodash")) return "vendor-lodash";
							return "vendor";
						}
						if (id.includes("assets/css")) {
							return "styles";
						}
					},
				},
				plugins: [],
				external: ["sharp"],
			},
			chunkSizeWarningLimit: 2000,
		},
		css: {
			preprocessorMaxWorkers: true,
			devSourcemap: true,
		},
		plugins: [
			tailwindcss(),
			{
				apply: "build",
				name: "vite-plugin-ignore-sourcemap-warnings",
				configResolved(config) {
					const originalOnWarn = config.build.rollupOptions.onwarn;
					config.build.rollupOptions.onwarn = (warning, warn) => {
						if (
							warning.code === "SOURCEMAP_BROKEN" &&
							warning.plugin === "@tailwindcss/vite:generate:build"
						) {
							return;
						}

						if (originalOnWarn) {
							originalOnWarn(warning, warn);
						} else {
							warn(warning);
						}
					};
				},
			},
		],
		server: {
			// hmr: {
			// 	protocol: "wss",
			// 	port: isDev ? 3002 : undefined,
			// 	host: isDev ? process.env.PUBLIC_SITE_URL : undefined,
			// },
			allowedHosts: true,
		},
		define: {
			global: "globalThis",
		},
		vue: {
			script: {
				globalTypeFiles: [
					fileURLToPath(new URL("./shared/types/index.d.ts", import.meta.url)),
				],
			},
		},
		optimizeDeps: {
			include: ["date-fns", "clsx", "vee-validate", "@vee-validate/zod", "zod"],
		},
	},
	nitro: {
		preset: "vercel",
		compressPublicAssets: isProd
			? {
					gzip: true,
					brotli: true,
				}
			: true,
		experimental: {
			websocket: true,
			wasm: false,
		},
		prerender: {
			crawlLinks: false,
			failOnError: false,
			ignore: ["/api/**", "/admin/**", "/__sitemap__/style.xsl"],
			routes: ["/robots.txt"],
		},

		minify: isProd,
		// Rollup config - HAPUS jika kosong
		// rollupConfig: {
		//   plugins: [], <- JANGAN pakai array kosong
		// },
		...(isDev && {
			devHandlers: [],
			devProxy: {
				// Proxy config jika perlu
			},
		}),
		...(isProd && {
			timing: false, // Disable timing headers di prod
		}),
	},
	hooks: {
		"vite:extendConfig": (config) => {
			// if (typeof config.server!.hmr === "object") {
			// 	config.server!.hmr.protocol = "wss";
			// }
		},
	},
	routeRules: {
		"/sitemap.xml": {
			isr: 3600,
			headers: {
				"Content-Type": "application/xml",
			},
		},
		"/_robots.txt": {
			prerender: true,
		},
		"/.well-known/**": {
			static: true,
			headers: {
				"Content-Type": "text/plain",
				"Cache-Control": "public, max-age=604800",
			},
		},
		"/_nuxt/**": {
			headers: {
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		},
		"/api/**": {
			cors: true,
			cache: false,
			headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
				"Access-Control-Allow-Headers": "Content-Type, Authorization",
			},
		},
	},
	site: {
		url: process.env.PUBLIC_SITE_URL,
		name: process.env.APP_NAME,
	},
	robots: {
		disallow: ["/admin", "/api"],
		allow: "/",
	},
	sitemap: {
		sitemapsPathPrefix: "/",
		sitemaps: {
			pages: {
				includeAppSources: true,
				exclude: ["/admin/**"],
			},
		},
		exclude: ["/admin/**"],
		defaults: {
			changefreq: "daily",
			priority: 0.7,
			lastmod: new Date().toISOString(),
		},
	},
	app: {
		baseURL: "/",
		buildAssetsDir: "/_nuxt/",
		cdnURL: isDev ? "" : undefined,
		head: {
			charset: "utf-8",
			viewport: "width=device-width, initial-scale=1",
			htmlAttrs: {
				lang: "en",
			},
			meta: [
				{ name: "format-detection", content: "telephone=no" },
				{ name: "robots", content: "index,follow" },
			],
			bodyAttrs: {
				"data-online-id": "",
				"data-logged-in": "false",
				class: "",
				style: `
      --expand-icon-src: url(/images/icons/expand.gif?v=20250528);
      --collapse-icon-src: url(/images/icons/collapse.gif?v=20250528);
      --play-icon-src: url(/images/icons/play.png?v=20250528);
      --jquery-ui-444444-src: url(/images/icons/ui-icons_444444_256x240.png?v=20250528);
      --jquery-ui-555555-src: url(/images/icons/ui-icons_555555_256x240.png?v=20250528);
      --jquery-ui-ffffff-src: url(/images/icons/ui-icons_ffffff_256x240.png?v=20250528);
      --jquery-ui-777620-src: url(/images/icons/ui-icons_777620_256x240.png?v=20250528);
      --jquery-ui-cc0000-src: url(/images/icons/ui-icons_cc0000_256x240.png?v=20250528);
      --jquery-ui-777777-src: url(/images/icons/ui-icons_777777_256x240.png?v=20250528);
    `,
			},
		},
		pageTransition: { name: "page", mode: "out-in" },
	},
	supabase: {
		url: process.env.SUPABASE_URL,
		key: process.env.SUPABASE_KEY,
		useSsrCookies: true,
		redirect: true,
		serviceKey: process.env.SUPABASE_SERVICE_KEY,
		redirectOptions: {
			login: "/login",
			callback: "/confirm",
			include: ["/admin(/*)?"],
			exclude: ["/"],
			saveRedirectToCookie: false,
		},
	},
	colorMode: {
		preference: "light",
		classSuffix: "",
		storage: "localStorage",
		storageKey: "nuxt-color-mode",
	},
	typescript: {
		shim: false,
	},
	icon: {
		clientBundle: {
			scan: true,
			sizeLimitKb: 256,
		},
		fetchTimeout: 2000,
		serverBundle: "local",
	},
	shadcn: {
		prefix: "",
		componentDir: "~/app/components/ui",
	},
	image: {
		quality: 80,
		format: ["avif", "webp", "jpeg", "jpg", "png", "gif"],
		screens: {
			xs: 320,
			sm: 640,
			md: 768,
			lg: 1024,
			xl: 1280,
			xxl: 1536,
			"2xl": 1536,
		},
	},
	runtimeConfig: {
		AppName: process.env.NUXT_APP_NAME,
		NodeApp: process.env.NODE_ENV,
		PublicUrl: process.env.PUBLIC_SITE_URL,
		AppSecret: process.env.APP_SECRET,
		public: {
			AppName: process.env.NUXT_APP_NAME,
			NodeApp: process.env.NODE_ENV,
			PublicUrl: process.env.PUBLIC_SITE_URL,
			AppSecret: process.env.APP_SECRET,
		},
	},
});
