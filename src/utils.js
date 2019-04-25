
class Utils {

	weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	weekdays2 = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	weekdays_upper = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	weekdays_upper_short = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	minutes_to_time = (minutes) => {
		return {
			hours: Math.floor(minutes/60),
			minutes: minutes%60,
		}
	}

	daysBetween(first, second) {
		
		first = new Date(first);
		second = new Date(second);

		// Copy date parts of the timestamps, discarding the time parts.
		var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
		var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

		// Do the math.
		var millisecondsPerDay = 1000 * 60 * 60 * 24;
		var millisBetween = two.getTime() - one.getTime();
		var days = millisBetween / millisecondsPerDay;

		// Round down.
		return Math.floor(days);
	}

	arraysEqual(first, second) {
		//if (typeof first !== 'array' || typeof second !== 'array') return false;

		if (first.length !== second.length) return false;
		for (let i = 0; i < first.length; ++i) {
			if (first[i] !== second[i]) return false;
		}
		return true;
	}
}

export default new Utils();