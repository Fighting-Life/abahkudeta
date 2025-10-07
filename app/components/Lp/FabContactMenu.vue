<script setup lang="ts">
interface MenuItem {
	id: string;
	icon: string;
	label?: string;
	link?: string;
	color?: string;
	action?: () => void;
}

interface Props {
	menuItems?: MenuItem[];
	position?: "left" | "right";
	bottom?: string;
	mainButtonColor?: string;
	mainIconColor?: string;
}

const props = withDefaults(defineProps<Props>(), {
	position: "left",
	bottom: "1.75rem",
	mainButtonColor: "#000000",
	mainIconColor: "#F0C90A",
});

// Default menu items
const defaultMenuItems: MenuItem[] = [
	{
		id: "1",
		icon: "/images/banner/rtp.gif",
		label: "RTP KUDETABET98",
		link: "/livechat",
		color: "#10b981",
	},
	{
		id: "2",
		icon: "/images/banner/wa.gif",
		label: "WHATSAPP KUDETABET98",
		link: "https://wa.me/1234567890",
		color: "#25d366",
	},
	{
		id: "3",
		icon: "/images/banner/telegram.gif",
		label: "TELEGRAM KUDETABET98",
		link: "https://t.me/yourusername",
		color: "#0088cc",
	},
];

// Reactive state
const isOpen = ref(false);
const isAnimating = ref(false);
const selctedHoverID = ref("0");

const items = computed(() => props.menuItems || defaultMenuItems);

const toggleMenu = () => {
	if (isAnimating.value) return;

	isAnimating.value = true;
	isOpen.value = !isOpen.value;

	setTimeout(() => {
		isAnimating.value = false;
	}, 600);
};

const handleItemClick = (item: MenuItem) => {
	if (item.action) {
		item.action();
	} else if (item.link) {
		if (item.link.startsWith("http")) {
			window.open(item.link, "_blank");
		} else {
			navigateTo(item.link);
		}
	}

	// Close menu after click
	setTimeout(() => {
		toggleMenu();
	}, 300);
};

const fabPosition = computed(() => ({
	[props.position]: "1rem",
	bottom: props.bottom,
}));

const getItemPosition = (index: number) => {
	const angle = 90; // Total angle spread (vertical)
	const startAngle = 270; // Start from top
	const radius = 80; // Distance from main button

	const itemAngle = startAngle + (angle / (items.value.length - 1)) * index;
	const radian = (itemAngle * Math.PI) / 180;

	const x = Math.cos(radian) * radius;
	const y = Math.sin(radian) * radius;

	return {
		transform: isOpen.value
			? `translate(${x}px, ${y}px) scale(1)`
			: "translate(0, 0) scale(0)",
		transitionDelay: isOpen.value
			? `${index * 50}ms`
			: `${(items.value.length - index - 1) * 50}ms`,
	};
};
</script>

<template>
	<div class="fab-container fixed z-50" :style="fabPosition">
		<!-- Backdrop overlay when open -->
		<Transition name="fade">
			<div
				v-show="isOpen"
				class="fab-backdrop fixed inset-0 -z-10 bg-black/50 backdrop-blur-sm"
				@click="toggleMenu"
			></div>
		</Transition>

		<!-- Sub menu items -->
		<div class="relative">
			<div
				v-for="(item, index) in items"
				:key="item.id"
				class="fab-sub-item absolute"
				:style="getItemPosition(index)"
			>
				<button
					class="fab-sub-button group relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#F0C90A] shadow-lg transition-all duration-300 hover:scale-110 active:scale-95"
					:aria-label="item.label"
					@click="handleItemClick(item)"
					@mouseenter="selctedHoverID = item.id"
					@mouseleave="selctedHoverID = '0'"
				>
					<img
						:src="item.icon"
						:alt="item.label"
						class="animate-icon-pulse h-10 w-auto text-white"
					/>
					<img src="" alt="" />

					<!-- Ripple effect -->
					<span class="ripple-ring"></span>

					<!-- Label tooltip (optional) -->
					<Transition name="slide-fade">
						<span
							v-if="selctedHoverID === item.id"
							class="fab-label pointer-events-none absolute rounded-lg bg-gray-900 px-3 py-1.5 font-sans text-sm font-semibold whitespace-nowrap text-yellow-400 shadow-lg"
							:class="
								position === 'left' ? 'left-full ml-3' : 'right-full mr-3'
							"
						>
							{{ item.label }}
						</span>
					</Transition>
				</button>
			</div>
		</div>

		<!-- Main FAB button -->
		<button
			class="fab-main-button hover:shadow-3xl relative flex cursor-pointer items-center justify-center rounded-lg border-2 border-solid border-[#F0C90A] px-1 py-2 shadow-2xl transition-all duration-300 active:scale-95"
			:style="{
				backgroundColor: mainButtonColor,
				transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
			}"
			aria-label="Toggle menu"
			@click="toggleMenu"
		>
			<!-- Hamburger/Close Icon -->
			<div class="relative h-6 w-6">
				<span
					class="icon-line absolute left-0 h-0.5 w-full bg-black transition-all duration-300"
					:class="isOpen ? 'top-1/2 rotate-0 opacity-0' : 'top-1 rotate-0'"
					:style="{ backgroundColor: mainIconColor }"
				></span>
				<span
					class="icon-line absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-black transition-all duration-300"
					:class="isOpen ? 'rotate-90' : 'rotate-0'"
					:style="{ backgroundColor: mainIconColor }"
				></span>
				<span
					class="icon-line absolute left-0 h-0.5 w-full bg-black transition-all duration-300"
					:class="isOpen ? 'top-1/2 rotate-0 opacity-0' : 'bottom-1 rotate-0'"
					:style="{ backgroundColor: mainIconColor }"
				></span>
			</div>

			<!-- Pulse ring effect -->
			<span
				class="pulse-ring absolute inset-0 rounded-2xl"
				:class="{ 'animate-ping-slow': !isOpen }"
				:style="{
					backgroundColor: mainButtonColor,
					opacity: 0.4,
				}"
			></span>
		</button>
	</div>
</template>

<style scoped>
/* FAB container */
.fab-container {
	will-change: transform;
}

/* Main FAB button */
.fab-main-button {
	will-change: transform, box-shadow;
}

.fab-main-button:hover {
	transform: scale(1.05);
}

/* Icon lines animation */
.icon-line {
	will-change: transform, opacity;
}

/* Sub menu items */
.fab-sub-item {
	will-change: transform;
	transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Sub buttons */
.fab-sub-button {
	will-change: transform;
	border: 2px solid rgba(255, 255, 255, 0.3);
}

.fab-sub-button:hover {
	box-shadow: 0 0 20px currentColor;
}

/* Icon pulse animation */
@keyframes icon-pulse {
	0%,
	100% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
}

.animate-icon-pulse {
	animation: icon-pulse 2s ease-in-out infinite;
}

/* Ripple ring effect */
.ripple-ring {
	position: absolute;
	inset: -4px;
	border-radius: inherit;
	border: 2px solid currentColor;
	opacity: 0;
	animation: ripple-pulse 2s ease-out infinite;
}

@keyframes ripple-pulse {
	0% {
		transform: scale(0.8);
		opacity: 1;
	}
	100% {
		transform: scale(1.4);
		opacity: 0;
	}
}

/* Pulse animation for main button */
@keyframes ping-slow {
	75%,
	100% {
		transform: scale(1.3);
		opacity: 0;
	}
}

.animate-ping-slow {
	animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

/* Backdrop fade transition */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* Label tooltip transitions - slide up from bottom */
.slide-fade-up-enter-active {
	transition: all 0.3s ease;
	transition-delay: 0.2s;
}

.slide-fade-up-leave-active {
	transition: all 0.2s ease;
}

.slide-fade-up-enter-from {
	opacity: 0;
	transform: translate(-50%, 10px);
}

.slide-fade-up-leave-to {
	opacity: 0;
	transform: translate(-50%, 10px);
}

.slide-fade-up-enter-to,
.slide-fade-up-leave-from {
	opacity: 1;
	transform: translate(-50%, 0);
}

/* Label styles */
.fab-label {
	z-index: 60;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
}

.fab-label::after {
	content: "";
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	width: 0;
	height: 0;
	border-style: solid;
	border-width: 6px 6px 0 6px;
	border-color: #1f2937 transparent transparent transparent;
}

/* Backdrop */
.fab-backdrop {
	cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
	.fab-main-button {
		width: 3.5rem;
		height: 3.5rem;
	}

	.fab-sub-button {
		width: 3rem;
		height: 3rem;
	}

	.fab-label {
		font-size: 0.75rem;
		padding: 0.375rem 0.75rem;
	}
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
	.fab-sub-item,
	.fab-main-button,
	.icon-line {
		transition: none;
	}

	.animate-icon-pulse,
	.animate-ping-slow,
	.ripple-ring {
		animation: none;
	}
}
</style>
