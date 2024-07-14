const $regWrapper = document.querySelector('.registration-wrapper');
const $regOpener = document.querySelector('.reg-opener');
const $arrow = document.querySelector('.arrow');
const $regForm = document.querySelector('.reg-form');
const $inputs = $regForm.querySelectorAll('.formInput');
const $playersList = document.querySelector('.players');
const $delete  = document.querySelector('.delete');
const $positionFilter = document.querySelector('#positionFilter');
const $clubFilter = document.querySelector('#clubFilter');
const $reset = document.querySelector('.reset');
const $searchName = document.querySelector('#searchName');
const $transfer = document.querySelector('.transfer');
const $transferPlayerBox = document.querySelector('.player-transfer-background');
const $transferClose = document.querySelector('.player-transfer-close');
const $transferablePlayer = document.querySelector('#transferablePlayer');
const $transferMenu = document.querySelector('.transfer-menu');

let isRegOpen = false;

const ALL_PLAYERS = JSON.parse(localStorage.getItem("players")) || [];


$regOpener.addEventListener('click', () => {
    if(!isRegOpen) {
        $regWrapper.style.transform = 'translateX(0px)';
    $arrow.style.transform = 'rotate(180deg)';
    isRegOpen = true;
    }
    else{
        $regWrapper.style.transform = 'translateX(-400px)';
        $arrow.style.transform = 'rotate(0deg)';
        isRegOpen = false;
    }
})

function Player(name , surname , age , image , position , club) {
    this.name  = name;
    this.surname = surname;
    this.age = age;
    this.image = image;
    this.position = position;
    this.club = club;    
}

const renderPlayers = (players) => {

    while($playersList.firstChild) {
        $playersList.removeChild($playersList.firstChild);
    }
    

    players.map(player => {
        const $list = document.createElement('div');
        $list.classList.add('players__list');
        $transferablePlayer.innerHTML = `<option selected disabled>O'yinchini tanlang</option>`
        $list.innerHTML += `<div class="list__img">
                <img src="${player.image}" alt="">
            </div>
            <div class="list__content">
                <h2>${player.surname} ${player.name}</h2>
                <p style="color: gray;">${player.age} yosh</p>
                <p>${player.club}</p>
                <p>${player.position}</p>
            </div>
            <div class="list__buttons">
                <button class="delete">Delete</button>
            </div>`
        $transferablePlayer.innerHTML += `
        <option value="${player.name}">${player.name}</option>`    

         $playersList.appendChild($list);   
    })
    
}

renderPlayers(ALL_PLAYERS);

const deletePlayer = (e) => {
    e.target.parentNode.parentNode.remove();
    ALL_PLAYERS.splice(ALL_PLAYERS.indexOf(e.target.parentNode.parentNode), 1);
    localStorage.setItem("players" , JSON.stringify(ALL_PLAYERS));
    renderPlayers(ALL_PLAYERS);
}

$playersList.addEventListener('click', deletePlayer);

const createPlayer = (e) =>{
    e.preventDefault();

    let values = Array.from($inputs).map(input => input.value);
    const player = new Player(...values);
    ALL_PLAYERS.push(player);
    localStorage.setItem("players" , JSON.stringify(ALL_PLAYERS));
    renderPlayers(ALL_PLAYERS);
    $inputs.forEach(input => input.value = "");
}

const filterPosition = () =>{
    const Filtered_Positions = ALL_PLAYERS.filter(player => player.position === $positionFilter.value);

    renderPlayers(Filtered_Positions);
}

const filterClub = () =>{
    const Filtered_Clubs = ALL_PLAYERS.filter(player => player.club === $clubFilter.value);

    renderPlayers(Filtered_Clubs);
}

$regForm.addEventListener('submit', createPlayer);
$positionFilter.addEventListener('change', filterPosition);
$clubFilter.addEventListener('change', filterClub);

$reset.addEventListener('click', () => {
    $positionFilter.selectedIndex = 0;
    $clubFilter.selectedIndex = 0;
    $searchName.value = "" ;
    renderPlayers(ALL_PLAYERS);
})

$searchName.addEventListener('input', () => {
    console.log($searchName.value);
    const filtered = ALL_PLAYERS.filter(player => player.name.toLowerCase().includes($searchName.value.toLowerCase()));
    renderPlayers(filtered);
})

$transfer.addEventListener('click' , () => {
    $transferPlayerBox.classList.remove('Nonactive');
})

$transferClose.addEventListener('click' , () => {
    $transferPlayerBox.classList.add('Nonactive');
})

$transferablePlayer.addEventListener('change' , () => {
    const transferable = ALL_PLAYERS.find(player => player.name === $transferablePlayer.value);
    console.log(transferable);
    const $transferButton = document.createElement('button');
    $transferButton.classList.add('transfer-button');
    const $transferredClub = document.createElement('select');
    $transferredClub.classList.add = 'transferredClub';
    $transferMenu.innerHTML = `<p>Current Club: ${transferable.club}</p>
                <i class="bi bi-arrow-right right-arrow"></i>
                `
    $transferMenu.appendChild($transferredClub);
    $transferredClub.innerHTML = `
                <option selected disabled>Club tanlang</option>
                <option value="barcelona">Barcelona</option>
                <option value="bayern">Bayern</option>
                <option value="manchester-city">Manchester City</option>
                <option value="chelsea">Chelsea</option>
                <option disabled value="real-madrid">Real Madrid</option>
                `
    $transferButton.innerHTML = `Transfer`;
    $transferMenu.appendChild($transferButton);

    $transferButton.addEventListener('click' , () => {
        transferable.club = $transferredClub.value;
        localStorage.setItem("players" , JSON.stringify(ALL_PLAYERS));
        renderPlayers(ALL_PLAYERS);
        $transferPlayerBox.classList.add('Nonactive');
        $transferMenu.innerHTML = ""
    })
})



