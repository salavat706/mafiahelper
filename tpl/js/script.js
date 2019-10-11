const mafia = 'mafia';
const doctor = 'doctor';
const maniac = 'maniac';
const cop = 'cop';
const slut = 'slut';

class Role {
	constructor(obj) {
		this.name = obj.name;
		this.sysnick = obj.sysnick;
	}
}

function getRoles() {
	return [
		{
			name: 'Мафия',
			sysnick: mafia
		},
		{
			name: 'Доктор',
			sysnick: doctor
		},
		{
			name: 'Манъяк',
			sysnick: maniac
		},
		{
			name: 'Комиссар',
			sysnick: cop
		},
		{
			name: 'Любовница',
			sysnick: slut
		}
	];
}

class Player {
	//sysnick mafia, doc 
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

$(document).ready(function () {

	//игроки
	var players = [];

	//все роли
	var roles = getRoles();

	//чей ход?
	var currentRoleIdx = 0;

	//Живые роли
	var livedRoles;

	//комбобокс с ролями
	getRoles().forEach(role => {
		var html = '<option value="'+role.sysnick+'">'+role.name+'</option>';
		$('.role').append(html);
	});

	$(".next").click(function () {
		var name = $(".name").val();
		var roleSysnick = $(".role").val();
		var roleName = $('.role option:selected').text()
		var roleObj = new Role({ name: roleName, sysnick: roleSysnick });
		players.push(new Player(name, roleObj));

		$(".name").val("");
		$(".role").val("");
	});

	//
	$(".cum").click(function () {
		$(".start_form").hide();

		players.forEach(player => {
			var tmp = '<div class="one_player">' + player.name + ' - ' + player.getRoleName() + '</div>';

			$(".player_list").prepend(tmp);
		});

		$(".player_list").show();

	});

	//кнопка перехода к следующей ночи
	$(".start").click(function (e) {
		$(".player_list").hide();

		livedRoles = getLivedRoles(players);

		drawPlayerCards(players,livedRoles[currentRoleIdx]);

		$(".main_table").show();
	});

	//клик по карте игрока
	$('body').on('click', '.player_card', function () {
		$(".player_card").removeClass("check");
		$(this).addClass("check");
		console.log(getLivedRoles(players));
	});

	//Ночь: переход к следующей роли
	$(".next_players").click(function (e) {
		var idx = getCheckedIdx(players);
		players[idx].addGuest(livedRoles[currentRoleIdx]);
		currentRoleIdx++;

		var nextRole = livedRoles[currentRoleIdx]
		if(nextRole)
			drawPlayerCards(players,nextRole);
		else {
			alert('Дневное голосование');
			drawPlayerCards(players);
			currentRoleIdx = 0;
			$('.killBtn').show();
			$('.next_players').hide();
			//todo итог ночи
			//ГОЛОСОВАНИЕ
		}
	});

	$('.killBtn').click(function() {
		var idx = getCheckedIdx(players);
		players[idx].kill();
		livedRoles = getLivedRoles(players);
		drawPlayerCards(players, livedRoles[currentRoleIdx]);
		$('.killBtn').hide();
		
		$('.next_players').show();

	})
});

function getCheckedIdx(players) {
	var idx = $(".player_card.check").attr("idx");
	if(!idx) {
		alert('Выберите цель');
		return;
	}
	return idx;
}

function getLivedRoles(players) {
	var result = [];
	players.forEach(player => {
		if(player.isDead) return;

		if(result.includes(player.role)) return;
		result.push(player.role);
	});
	return result;
}

function drawPlayerCards(players,currentRole) {

	var labelText = currentRole ? 'Просыпается ' + currentRole.name : '';
	$('.currentRole').text(labelText);

	$(".player_grid").empty();
	players.forEach(function (player, i) {
		if(player.isDead) return;
		if(currentRole && player.isRole(currentRole)) return;

		var tmp = '<div class="player_card" idx="' + i + '">' + player.name + ' - ' + player.getRoleName() + '</div>';
		$(".player_grid").prepend(tmp);
	});
}