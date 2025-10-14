export default defineNuxtRouteMiddleware(async (to, from) => {
	const user = useSupabaseUser();
	const supabase = useSupabaseClient<Database>();

	// Check if user is logged in
	if (!user.value) {
		return navigateTo("/");
	}

	// Get user profile to check role
	const { data: profile, error } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.value.id)
		.single();

	// If error or not admin, redirect
	if (error || profile?.role !== "admin") {
		return navigateTo("/account?q=main&t=summary");
	}

	// If admin, allow access
	return;
});
