<script setup lang="ts">
const defaultPayments = [
	"/images/banner/payment/BCA.png",
	"/images/banner/payment/BNI.png",
	"/images/banner/payment/BRI.png",
	"/images/banner/payment/DANA1.png",
	"/images/banner/payment/GOPAY1.png",
	"/images/banner/payment/LINKAJA1.png",
	"/images/banner/payment/MANDIRI.png",
	"/images/banner/payment/OVO1.png",
	"/images/banner/payment/XL4.png",
];
const currentDate = new Date();
</script>
<template>
	<footer class="relative w-full bg-gray-950 pb-20 lg:pb-0">
		<div class="container mx-auto w-full px-2 lg:max-w-[1024px]">
			<div class="w-full space-y-5">
				<div class="border-b border-yellow-400 py-3">
					<div
						class="flex w-full flex-col items-center justify-center lg:flex-row lg:justify-end"
					>
						<img
							src="/images/banner/payment/siam-engine.webp"
							alt=""
							class="h-16 w-auto object-fill"
						/>
					</div>
				</div>
				<div
					class="flex w-full flex-col items-center gap-5 lg:flex-row lg:gap-0"
				>
					<div class="w-full space-y-5 lg:w-[85%]">
						<div
							class="w-full text-center text-sm text-gray-400 uppercase lg:text-start"
						>
							Metode Pembayaran
						</div>
						<div
							class="flex flex-wrap items-center justify-center gap-3 lg:justify-start"
						>
							<img
								v-for="(payment, i) in defaultPayments"
								:key="i"
								:src="payment"
								alt="Payment Method"
								class="h-9 w-auto object-fill"
							/>
						</div>
					</div>
					<div class="w-full space-y-5 lg:w-[15%]">
						<div class="w-full text-center text-sm text-gray-400 uppercase">
							Hubungi Kami
						</div>
						<div class="flex w-full items-center justify-center">
							<a href="#" class="cursor-pointer active:scale-95">
								<Icon name="logos:telegram" class="text-6xl" />
							</a>
						</div>
					</div>
				</div>
			</div>
			<div class="w-full space-y-5">
				<div class="border-b border-yellow-400 py-3"></div>
				<ul
					class="flex w-full list-none flex-col gap-3 overflow-hidden overflow-x-auto rounded-lg bg-gradient-to-r from-[#fbeb8c] to-[#9d7e39] px-2 py-2 text-black lg:flex-row lg:gap-5"
				>
					<li>
						<a
							href="wa.me/6282277602113"
							target="_blank"
							rel="noopener"
							class="flex items-center justify-center gap-2"
						>
							<div
								class="flex items-center justify-center rounded-md border-2 border-solid border-gray-900 p-1"
							>
								<icon name="ic:baseline-whatsapp" class="text-xl font-bold" />
							</div>
							<div class="truncate text-sm font-semibold">6282277602113</div>
						</a>
					</li>
					<li>
						<a
							href="https://t.me/kudetabet98"
							target="_blank"
							rel="noopener"
							class="flex items-center justify-center gap-2"
						>
							<div
								class="flex items-center justify-center rounded-md border-2 border-solid border-gray-900 p-1"
							>
								<icon name="mdi:telegram" class="text-xl font-bold" />
							</div>
							<div class="truncate text-sm font-semibold">
								https://t.me/kudetabet98
							</div>
						</a>
					</li>
					<li>
						<a
							href="mailto:kudetabet98@gmail.com"
							target="_blank"
							rel="noopener"
							class="flex items-center justify-center gap-2"
						>
							<div
								class="flex items-center justify-center rounded-md border-2 border-solid border-gray-900 p-1"
							>
								<icon name="bx:bxl-gmail" class="text-xl font-bold" />
							</div>
							<div class="truncate text-sm font-semibold">
								kudetabet98@gmail.com
							</div>
						</a>
					</li>
					<li>
						<a
							href="https://www.facebook.com/kudetabet98"
							target="_blank"
							rel="noopener"
							class="flex items-center justify-center gap-2"
						>
							<div
								class="flex items-center justify-center rounded-md border-2 border-solid border-gray-900 p-1"
							>
								<icon name="ic:baseline-facebook" class="text-xl font-bold" />
							</div>
							<div class="truncate text-sm font-semibold">
								https://www.facebook.com/kudetabet98
							</div>
						</a>
					</li>
					<li>
						<a
							href="https://www.instagram.com/kudetabet98_"
							target="_blank"
							rel="noopener"
							class="flex items-center justify-center gap-2"
						>
							<div
								class="flex items-center justify-center rounded-md border-2 border-solid border-gray-900 p-1"
							>
								<icon name="mdi:instagram" class="text-xl font-bold" />
							</div>
							<div class="truncate text-sm font-semibold">
								https://www.instagram.com/kudetabet98_
							</div>
						</a>
					</li>
				</ul>
			</div>
			<div class="grid gap-4 py-5">
				<h2 class="text-center text-xl font-medium text-[#ff9900] lg:text-3xl">
					KUDETABET98 Platform Hiburan Digital Terbaru di Indonesia
				</h2>
				<p class="text-xs break-all lg:text-sm">
					<strong class="text-red-600">KUDETABET98</strong> merupakan situs
					Kudetabet 98 permainan online Kudetabet98 terpercaya resmi dengan
					tampilan modern dan canggih tidak lupa dengan bonus berlimpah.
					Bagaimana tidak ? zona situs game online sudah berkembang semakin
					lengkap, modern dan banyak jenis. Tentu saja para pecinta game yang
					awalnya hanya bermain di darat juga ikut beralih ke sistem Kudetabet
					online dan mencari jasa taruhan yang terbaik saja.
				</p>
				<p class="text-xs break-all lg:text-sm">
					Para artikel ini kita akan merekomendasikan zona slot terbaik yang
					paling banyak peminat serta sudah dipercayai oleh ribuan member aktif.
					Langsung saja saat ini yaitu Kudetabet98 yang paling terbaik dan
					terpercaya untuk para kalangan pecinta game online.
				</p>
				<h2 class="text-center text-xl font-medium text-[#ff9900] lg:text-3xl">
					Kudetabet98 Situs Slot Gacor Slothoki777 Game Lengkap
				</h2>
				<p class="text-xs break-all lg:text-sm">
					Siapa itu kudetabet98 ? Jika anda merupakan pecinta situs slot gacor
					pastinya sudah tidak asing lagi dengan agen Kudetabet98 selaku bandar
					game indonesia. Perkenalkan, Kudetabet98 adalah daftar situs zona
					situs slot gacor slothoki777 terbaik dan slotking99 game lengkap
					terbaik bola 365 pasti menang karena deposit pulsa tanpa potongan.
				</p>
				<p class="text-xs break-all lg:text-sm">
					Permainan tersebut meliputi taruhan slot online, casino online,
					taruhan bola, game poker online, capsa susun, togel, tembak ikan,
					sabung ayam dan lain sebagainya. Dan yang menariknya adalah bila
					mendaftar bersama situs slot Kudetabet98 semua permainan yang tersedia
					bisa di akses hanya dengan 1 user ID saja loh. Tanpa harus repot lagi
					serta untuk pemindahan saldo dari kudetabet game yang berlaku semuanya
					otomatis dipindahkan.
				</p>
				<h2 class="text-center text-xl font-medium text-[#ff9900] lg:text-3xl">
					Kenapa Kita Harus Mempercayai Kudetabet98 Slotking99 Zona Slot Terbaik
				</h2>
				<p class="text-xs break-all lg:text-sm">
					Sebagai agen online terpercaya pastinya semua pecinta taruhan harus
					bergabung dengan situs yang tepat. Dengan sistem transaksi deposit dan
					withdraw yang super cepat yaitu hanya memakan waktu maksimal 5 menit
					saja. Semua transaksi akan diproses oleh sistem slotking99 bersama
					kudetabet98. Pastinya bersama agen Kudetabet Slot juga semua member
					akan dipandu langsung oleh costumer service yang aktif 24 jam serta
					ramah dan berpengalaman.
				</p>
				<p class="text-xs break-all lg:text-sm">
					Para member juga akan di tawarkan berbagai macam jenis promo situs
					slot gacor dan slotking99 indonesia bonus menarik agar membantu para
					membernya agar bisa mendapatkan keuntungan serta kemenangan yang
					maksimal. Berbagai macam promo tersebut bisa langsung di cek pada menu
					promosi Agen Kudetabet98 situs bola 365 yang meliputi bonus member
					baru. Bonus deposit harian, bonus cashback mingguan, bonus refferal,
					dan berbagai macam Event Menarik yang bisa di klaim setiap harinya !
				</p>
				<h2 class="text-center text-xl font-medium text-[#ff9900] lg:text-3xl">
					10 Daftar Situs Slot Gacor Terbaik Indonesia Game Lengkap
				</h2>
				<p class="text-xs break-all lg:text-sm">
					Berikut ini 10 daftar situs slot gacor terbaik yang direkomendasi juga
					untuk anda :
				</p>
				<ul class="list-disc ps-4 text-xs break-all lg:text-sm">
					<li>
						Situs Sportsbook yang langsung bekerja sama dengan produk raksasa :
						<span class="text-[#ff6600]">
							SBOBET | SABA SPORTS | TF GAMING | VIRTUAL SPORTS PP | SBO VIRTUAL
							SPORTS
						</span>
					</li>
					<li>
						Situs Slot Gacor paling booming di indonesia :
						<span class="text-[#ff6600]">
							PRAGMATIC PLAY | MICROGAMING | PG SOFT | LIVE 22 | SLOT 88 | ION
							SLOT | JOKER | SPADE GAMING | HABANERO |
						</span>
						dan puluhan game lainnya.
					</li>
					<li>
						Situs Live Casino paling lengkap dan populer :
						<span class="text-[#ff6600]">
							ION CASINO | MG LIVE | EVO GAMING | SEXY BACCARAT | PRETTY GAMING
							| ASIA GAMING | SBO CASINO | DREAM GAMING
						</span>
					</li>
					<li>
						Situs Arcade jenis game ringan yang menghibur :
						<span class="text-[#ff6600]">
							PRAGMATIC FISHING | GAMATRON | GIOCCO PLUS | ADVANTPLAY GAMING |
							CQ9
						</span>
					</li>
					<li>
						Situs Poker salah satu jenis game yang membutuhkan keahlian khusus :
						<span class="text-[#ff6600]">IDN PLAY | 9GAMING | BALAK PLAY</span>
					</li>
					<li>
						Situs Togel yang sudah merakyat :
						<span class="text-[#ff6600]">NEX4D</span>
					</li>
					<li>
						Situs Sabung Ayam yang sudah turun menurun di berbagai wilayah
						indonesia :
						<span class="text-[#ff6600]">Ehm297 | SV388</span>
					</li>
					<li>
						Situs Game
						<span class="text-[#ff6600]">MM TANGKAS</span> sempat menjadi game
						paling populer di seluruh indonesia dan beroperasi di casino asli
						sejak tahun 1960an.
					</li>
					<li>
						Situs Tembak Ikan merupakan permainan yang cukup trending dan masih
						bisa ditemukan cukup banyak di darat :
						<span class="text-[#ff6600]"
							>CQ9 FISHING | SPADE GAMING FISHING | JOKER FISHING</span
						>
					</li>
					<li>
						Situs Game
						<span class="text-[#ff6600]">FUNKY GAMES</span> yang hadir terbaru
						untuk menghibur para pecinta situs game online.
					</li>
				</ul>
				<h2 class="text-center text-xl font-medium text-[#ff9900] lg:text-3xl">
					Kapan Kudetabet98 Beroperasi Sebagai Situs Game Lengkap Dewa Slot 88
				</h2>
				<p class="text-xs break-all lg:text-sm">
					Secara resmi, kudetabet98 sudah melayani daftar situs game sejak tahun
					2017 dan mendapatkan lisensi resmi beroperasi resmi kepada semua
					masyarakat indonesia. Dengan didukung oleh puluhan provider raksasa
					terkemuka di atas, pastinya semua member yang memilih kudetabet98
					dijamin tidak akan kecewa lagi.
				</p>
				<p class="text-xs break-all lg:text-sm">
					Selama 5 tahun berjalan, situs kudeta slotking99 telah banyak
					memberikan inovasi terbaru situs bola slot yang di sediakan maupun
					promo dan event yang di berikan. Apalagi jenis permainan dewa slot 88
					memberikan yang terbaik bagi para bettor dan member setia Kudetabet98
					denganupdate pilihan permainan paling lengkap.
				</p>
				<p class="text-xs break-all lg:text-sm">
					Apalagi jaman sekarang yang sudah semakin maju, selain menggunakan
					transaksi via metode bank bisa juga menggunakan E wallet . Bersama
					Kudetabet98 para member mix parlay 365 juga bisa melakukan transaksi
					khususnya deposit via pulsa saja dengan didukung oleh provider
					Telkomsel Dan XL. Yang menariknya adalah semua member situs slot
					deposit pulsa tanpa potongan. Semua ini tersedia pastinya dikarenakan
					basis agar member kudetabet 98 bisa terus memaksimalkan tingkat
					kemenangan nya.
				</p>
				<h2 class="text-center text-xl font-medium text-[#ff9900] lg:text-3xl">
					Dewa Slot 88 Jenis Permainan Favorit Kudetabet98
				</h2>
				<p class="text-xs break-all lg:text-sm">
					Jaman sekarang ini dewa slot 88 memang menjadi permainan yang sudah
					mendominasi. Bagaimana tidak, jenis permainan ini memberikan layanan
					dewa slot 88 login sistem paling mudah untuk dicoba. Dengan primadona
					permainan favoritnya adalah slot 88 yang menjadi barisan kedua setelah
					pragmatic play.
				</p>
				<p class="text-xs break-all lg:text-sm">
					Tidak tanggung, untuk sistem dewa slot 88 deposit pulsa juga sangat
					mudah. Bahkan bersama Kudetabet98 yang mempromosikan deposit pulsa
					tanpa potongan tentu saja memudahkan banyak member untuk meraih
					kemenangan. Dewa slot 88 link alternatif nya cukup akses ke situs
					kudetabet 98 saja maka kita sudah bisa akses secara mudah. Sistem dewa
					slot 88 apk juga mengikuti modern nya jaman dan teknologi yang sudah
					berkembang pesat
				</p>
				<h2 class="text-center text-xl font-medium text-[#ff9900] lg:text-3xl">
					Dimana Cara Daftar Bersama Kudetabet98 Yang Baik dan Benar
				</h2>
				<p class="text-xs break-all lg:text-sm">
					Tentu saja dari segi cara daftar bersama Kudetabet98 sangatlah mudah
					dan sederhana saja. Cukup melakukan pendaftaran langsung dari website
					di kolom pendaftaran. Maka user id akan langsung siap saat itu juga
					(dalam hitungan per detik).
				</p>
				<p class="text-xs break-all lg:text-sm">
					Ataupun untuk lebih efisien bisa melalui Livechat, Whatsapp, Telegram
					dan Email pastinya didukung service selama 1x24 jam nonstop. Kepada
					anda sehingga bisa menikmati permainan ini jauh lebih nyaman kapan dan
					dimanapun ingin menikmati aldernalin situs game bola dan slot online.
				</p>
				<h2 class="text-center text-xl font-medium text-[#ff9900] lg:text-3xl">
					FAQ - Bagaimana member bisa mendapatkan maxwin di kudetabet98
				</h2>
				<ul class="list-disc ps-4 text-xs break-all lg:text-sm">
					<li>
						<span class="font-semibold text-[#ff9900]">RTP</span> merupakan
						Return To Player, istilah RTP oleh pemain slotking99 yang ingin
						mengetahui berapa besar kecilnya kemenangan mereka dalam memainkan
						permainan yang akan dimainkan. Sehingga jika mengetahui RTP games
						slot yang akan di mainkan, pemain akan memiliki peluang slot pasti
						menang yang tinggi.
					</li>
					<li>
						<span class="font-semibold text-[#ff9900]">Pola Permainan</span>
						Pola permainan di berikan kepada member-member kudetabet98 merupakan
						bocoran Pola yang di dapatkan Kudetabet98 langsung dari provider
						untuk membantu para member mendapatkan pola main yang jitu. Sehingga
						kemungkinan JP ketika melakukan permainan akan tinggi.
					</li>
					<li>
						<span class="font-semibold text-[#ff9900]">Trik bermain</span> Dalam
						bermain slot, para member wajib mengetahui trik bermain agar bisa
						mendapatkan maxwin. Trik yang bisa di lakukan adalah dengan
						melakukan Bet kecil dahulu kemudian jika TO naik di naikkan betnya
						secara bertahap.
					</li>
					<li>
						<span class="font-semibold text-[#ff9900]"
							>Manfaatkan Sistem Deposit Pulsa</span
						>
						Seperti yang sudah kita ketahui bahwa agen Kudetabet98 menyediakan
						jasa layanan taruhan deposit pulsa tanpa potongan. Ini sangat cocok
						untuk member dewa slot 88 game bola deposit pulsa karena syarat wd
						TO yang diberikan sangat rendah yaitu cuma x1.
					</li>
				</ul>
			</div>
		</div>
		<div class="border-b border-gray-700 py-2"></div>
		<div class="container mx-auto w-full px-2 py-5 lg:max-w-[1024px]">
			<div
				class="flex w-full flex-col items-center justify-center gap-5 lg:flex-row lg:justify-between lg:gap-0"
			>
				<div class="text-sm">
					©{{ currentDate.getFullYear() }} KUDETABET98. Hak cipta dilindungi |
					18+
				</div>
				<img
					src="/images/banner/gambling-commission.svg"
					alt=""
					class="h-10 w-auto"
				/>
			</div>
		</div>
	</footer>
</template>
<style scoped></style>
