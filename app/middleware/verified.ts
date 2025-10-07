export default defineNuxtRouteMiddleware(async (to, from) => {
	const user = useSupabaseUser();
	const supabase = useSupabaseClient<Database>();

	// Check if user is logged in
	if (!user.value) {
		return navigateTo("/");
	}

	// Check if email is verified
	const {
		data: { user: authUser },
		error,
	} = await supabase.auth.getUser();

	if (error || !authUser?.email_confirmed_at) {
		return navigateTo({
			path: "/verify-email",
			query: { redirect: to.fullPath },
		});
	}

	return;
});
