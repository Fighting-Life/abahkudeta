<script setup lang="ts">
const openLanguage = ref(false);
</script>
<template>
	<div
		class="language-selector-container desktop"
		style="
			--image-src: url(//d33egg70nrp50s.cloudfront.net/Images/~zelma-beta/dark-gold/layout/flags.png?v=20250528);
		"
	>
		<div
			id="language_selector_trigger"
			data-toggle="dropdown"
			class="language-selector-trigger"
			data-language="id"
			@click="openLanguage = true"
		>
			<i data-language="id"></i>
			<i data-icon="dropdown"></i>
		</div>
		<ul v-if="openLanguage" class="dropdown-menu language-selector">
			<li class="language_selector" data-language="en">
				<i data-language="en"></i>
				<div class="language-name">
					<div>ENGLISH</div>
					<div>ENGLISH</div>
				</div>
			</li>
			<li class="language_selector" data-language="id">
				<i data-language="id"></i>
				<div class="language-name">
					<div>BHS INDONESIA</div>
					<div>INDONESIAN</div>
				</div>
			</li>
			<li class="language_selector" data-language="kr">
				<i data-language="kr"></i>
				<div class="language-name">
					<div>한국어</div>
					<div>KOREAN</div>
				</div>
			</li>
			<li class="language_selector" data-language="cn">
				<i data-language="cn"></i>
				<div class="language-name">
					<div>中文</div>
					<div>CHINESE</div>
				</div>
			</li>
			<li class="language_selector" data-language="jp">
				<i data-language="jp"></i>
				<div class="language-name">
					<div>日本語</div>
					<div>JAPANESE</div>
				</div>
			</li>
			<li class="language_selector" data-language="th">
				<i data-language="th"></i>
				<div class="language-name">
					<div>ไทย</div>
					<div>THAI</div>
				</div>
			</li>
			<li class="language_selector" data-language="my">
				<i data-language="my"></i>
				<div class="language-name">
					<div>မြန်မာစာ</div>
					<div>BURMESE</div>
				</div>
			</li>
			<li class="language_selector" data-language="kh">
				<i data-language="kh"></i>
				<div class="language-name">
					<div>ខេមរភាសា</div>
					<div>KHMER</div>
				</div>
			</li>
			<li class="language_selector" data-language="hi">
				<i data-language="hi"></i>
				<div class="language-name">
					<div>हिन्दी</div>
					<div>HINDI</div>
				</div>
			</li>
			<li class="language_selector" data-language="ta">
				<i data-language="ta"></i>
				<div class="language-name">
					<div>தமிழ்</div>
					<div>TAMIL</div>
				</div>
			</li>
			<li class="language_selector" data-language="te">
				<i data-language="te"></i>
				<div class="language-name">
					<div>తెలుగు</div>
					<div>TELUGU</div>
				</div>
			</li>
			<li class="language_selector" data-language="vi">
				<i data-language="vi"></i>
				<div class="language-name">
					<div>Tiếng Việt</div>
					<div>VIETNAMESE</div>
				</div>
			</li>
			<li class="language_selector" data-language="bn">
				<i data-language="bn"></i>
				<div class="language-name">
					<div>বাংলাদেশী</div>
					<div>BENGALI</div>
				</div>
			</li>
			<li class="language_selector" data-language="pt">
				<i data-language="pt"></i>
				<div class="language-name">
					<div>Português</div>
					<div>PORTUGESE</div>
				</div>
			</li>
		</ul>
	</div>
</template>

<style scoped></style>
