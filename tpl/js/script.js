const mafia = 'mafia';
const doctor = 'doctor';
const maniac = 'maniac';
const cop = 'cop';
const slut = 'slut';

//получить все роли либо одну роль
function getRoles(sysnick) {
	var roles = {
		mafia: new Role('Мафия', mafia),
		doctor: new Role('Доктор', doctor),
		maniac: new Role('Манъяк', maniac),
		cop: new Role('Комиссар', cop),
		slut: new Role('Любовница', slut)
	}

	if(sysnick)
		return roles[sysnick];

	return roles;
}

$(document).ready(function () {

	//игроки
	var players = [];

	//все роли
	var roles = getRoles();

	//группы игроков :: мафии, шерифы, доктора
	var groups = [];

	//чей ход?
	var currentGroup;
	var currentRole;
	var isDay = false;

	//комбобокс с ролями
	for(var idx in roles){
		var role = roles[idx];
		var html = '<option value="'+role.sysnick+'">'+role.name+'</option>';
		$('.role').append(html);
	};

	//ВБИТЬ
	$(".next").click(function () {
		var name = $(".name").val();
		var roleSysnick = $(".role").val();
		var roleName = $('.role option:selected').text()
		var roleObj = new Role(roleName, roleSysnick );
		players.push(new Player(name, roleObj));

		$(".name").val("");
		$(".role").val("");
	});

	//КОНЧИТЬ
	$(".cum").click(function () {
		$(".start_form").hide();

		players.forEach(player => {
			var tmp = '<div class="one_player">' + player.name + ' - ' + player.getRoleName() + '</div>';

			$(".player_list").prepend(tmp);
		});

		$(".player_list").show();

	});

	//СТАРТ
	$(".start").click(function (e) {
		$(".player_list").hide();

		groups = getLivedRoles(players);
		currentGroup = groups.shift();
		currentRole = currentGroup[0].getRole();


		drawPlayerCards(players);

		updatePlayerCards(players, currentRole);

		$(".main_table").show();
	});

	//клик по карте игрока
	$('body').on('click', '.player_card', function () {
		$(".player_card").removeClass("check");
		var el = $(this);
		if(!el.hasClass('disabled') && !el.hasClass('dead'))
			el.addClass("check");
	});

	//ДАЛЕЕ
	$(".next_players").click(function (e) {
		var idx = getCheckedIdx();
		players[idx].addGuest(currentRole);

		currentGroup = groups.shift();
		if(currentGroup) {
			currentRole = currentGroup[0].getRole();
			updatePlayerCards(players,currentRole);
		}
		else {
			alert('Дневное голосование');
			updatePlayerCards(players);
			$('.killBtn').show();
			$('.next_players').hide();
			//todo итог ночи
		}
	});

	//УБИТЬ
	$('.killBtn').click(function() {
		var idx = getCheckedIdx();
		players[idx].kill();
		groups = getLivedRoles(players);
		updatePlayerCards(players, currentRole);
		$('.killBtn').hide();
		
		$('.next_players').show();

	})
});

//логика после ночи
function afterNight() {

}

//получить индекс выделенной карточки
function getCheckedIdx(players) {
	var idx = $(".player_card.check").attr("idx");
	if(!idx) {
		alert('Выберите цель');
		return;
	}
	return idx;
}

//живые роли
function getLivedRoles(players) {
	var groups = {};
	players.forEach(player => {
		if(player.isDead) return;
		var roleSysnick = player.getRoleSysnick();;
		if(groups[roleSysnick]) {
			groups[roleSysnick].push(player);
		} else {
			groups[roleSysnick] = [ player ];
		}
	});

	var resultArr = [];
	for(var sysnick in groups) {
		resultArr.push(groups[sysnick]);
	}

	//группа.игрок.роль
	return resultArr;
}

//нарисовать карточки игроков
function drawPlayerCards(players) {
	$(".player_grid").empty();
	players.forEach(function (player, i) {
		var tmp = '<div class="player_card" idx="' + i + '">' + player.name + ' - ' + player.getRoleName() + '</div>';
		$(".player_grid").prepend(tmp);
	});
}

//обновить стили карточек игроков
function updatePlayerCards(players,currentRole) {
	var labelText = currentRole ? 'Просыпается ' + currentRole.name : 'Дневное голосование';
	$('.currentRole').text(labelText);

	players.forEach(function (player, i) {
		var el = $('[idx=' + i + ']');
		el.removeClass();
		el.addClass('player_card');
		if(player.isDead) {
			el.addClass('dead');
		} else if (currentRole && player.isRole(currentRole)) {
			el.addClass('disabled');
		}
	});
}