class Player {
	constructor(name, role) {
		this.name = name;
		this.role = role;
		this.guests = [];

		this.isDead = false;
	}

	addGuest(role) {
		return this.guests.push(role);
	}

	getRoleSysnick() {
		return this.role.sysnick;
	}

	getRoleName() {
		return this.role.name;
	}

	kill() {
		this.isDead = true;
	}

	isRole(role) {
		return this.role.sysnick == role.sysnick;
	}

	isKilled() {
		return this.guests.includes(mafia);
	}

	isFucked() {
		return this.guests.includes(slut);
	}

	isHealed() {
		return this.guests.includes(doctor);
	}

	isManiac() {
		return this.guests.includes(maniac);
	}

	isChecke() {
		return this.guests.includes(cop)
	}
}

class Role {
	constructor(name, sysnick) {
		this.name = name;
		this.sysnick = sysnick;
	}
}
