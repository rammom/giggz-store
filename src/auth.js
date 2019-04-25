import axios from 'axios';
import jwt_decode from 'jwt-decode';

class Auth {
	constructor() {

		// Add a request interceptor
		axios.interceptors.request.use(function (request) {

			// hacky way to avoid adding header on external requests
			if (!request.url.includes("http"))
				request.headers.Authorization = `bearer ${localStorage.getItem('giggz-emp-tkn')}`;

			return request;
		}, function (error) {
			console.log('error');
			return;
		});

		// Add a response interceptor
		axios.interceptors.response.use(function (response) {
			return response;
		}, function (error) {
			//ts.logout();
			console.log(error);
			return;
		});
	}

	async register(body, success, fail) {
		console.log("registering...");
		await axios.post('/auth/register', body)
			.then(res => {
				return success(res);
			})
			.catch(err => {
				return fail(err.response.data);
			})
	}

	async login(body, success, fail) {
		console.log("logging in...");
		console.log(body);
		await axios.post('/auth/employee-login', body)
			.then(res => {
				localStorage.setItem('giggz-emp-tkn', res.data.token);
				return success ? success(res) : null;
			})
			.catch(err => fail ? fail(err) : null);
	}

	logout() {
		// so far only client side logout is setup for JTW
		// may want to implement a redis stored backlist per user in the future for server side logouts.
		console.log("logging out...");
		localStorage.setItem('giggz-emp-tkn', null);
		window.location.href = "/";
	}

	getCachedUser() {
		if (!this.isAuthenticated()) return {};
		let token = localStorage.getItem('giggz-emp-tkn');
		let user = jwt_decode(token).user;
		user.firstname = user.firstname.substring(0, 1) + user.firstname.substring(1).toLowerCase();
		user.lastname = user.lastname.substring(0, 1) + user.lastname.substring(1).toLowerCase();
		user.email = user.email.toLowerCase();
		return user;
	}

	isAuthenticated() {
		return localStorage.getItem('giggz-emp-tkn') !== null && localStorage.getItem('giggz-emp-tkn') !== "null";
	}
}

export default new Auth();