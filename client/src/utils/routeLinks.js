export const RouteLinks = {
	common: [
		{
			icon: 'home',
			text: 'Home',
			link: '/'
		},
		{
			icon: 'sign-in',
			text: 'Login',
			link: '/login',
			restricted: true
		}
	],
	admin: [
		{
			icon: 'sign-out',
			text: 'Logout',
			link: '/logout'
		},
		{
			icon: 'home',
			text: 'Admin',
			link: '/admin'
		},
		{
			icon: 'clipboard',
			text: 'My Posts',
			link: '/admin/posts'
		},
		{
			icon: 'plus',
			text: 'Add Post',
			link: '/admin/posts/create'
		}
	]
}