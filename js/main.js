console.log('Starting up');

'use strict'; // Start of use strict

var gNextId = 1;
var gProjs = new Array();
gProjs = [
    {
        id: gNextId++,
        name: 'Minesweeper',
        title: 'Minesweeper game',
        decs: 'The objective of the game is to clear a rectangular board containing hidden "mines" or bombs without detonating any of them, with help from clues about the number of neighboring mines in each field',
        url: 'img/portfolio/minesweeper.png',
        link: 'projs/Mine_Sweeper/index.html',
        publishedAt: 1548288000000,
        labels: ['Codding Accademy', 'Game']
    },
    {
        id: gNextId++,
        name: 'Packman',
        title: 'Packman Game',
        decs: 'In Pac-Man, the player makes a Pac-Man, a yellow disc, move around a maze. The goal is to eat every yellow pellet (circles) while not getting caught by the ghosts/monsters. For extra points, fruits that appear can also be eaten. When Pac-Man eats a white pellet, the ghosts turn blue and can be eaten',
        url: 'img/portfolio/packman.png',
        link: 'projs/pacman/index.html',
        publishedAt: 1548028800000,
        labels: ['Codding Accademy', 'Game']
    },
    {
        id: gNextId++,
        name: 'BookShop',
        title: 'Bookshop Stock Managment',
        decs: 'Stock Managment are responsible for overseeing and managing the operation of the bookstore',
        url: 'img/portfolio/bookshop.png',
        link: 'projs/book-shop/index.html',
        publishedAt: 1549152000000,
        labels: ['Codding Accademy', 'Website']
    }
]
function initPage() {
    renderTable();
}

function renderTable() {
    var portfolioContain = '';
    gProjs.forEach(function (proj) {
        portfolioContain += creatPortfolioRow(proj);
    });
    $('.row.portfolio-contain').html(portfolioContain);
}

function creatPortfolioRow(proj) {
    var strHTML = `
    <div class="col-md-4 col-sm-6 portfolio-item" onclick="createPortfolioModal(${proj.id})">
        <a class="portfolio-link" data-toggle="modal" href="#portfolioModal">
        <div class="portfolio-hover">
            <div class="portfolio-hover-content">
            <i class="fa fa-plus fa-3x"></i>
            </div>
        </div>
        <img class="img-fluid" src="${proj.url}" alt="">
        </a>
        <div class="portfolio-caption">
        <h4>${proj.name}</h4>
        <p class="text-muted">${proj.title}</p>
        </div>
    </div> `;
    return strHTML;
}

function createPortfolioModal(projId) {
    var project = gProjs.find(proj => proj.id === projId);
    var projPublishTime = new Date(project.publishedAt);

    $('.modal-body >h2').text(project.name);
    $('.item-intro').text(project.title);
    $('.desc').text(project.decs);
    $('.img-fluid.d-block.mx-auto').attr('src', `${project.url}`);
    $('.date').html(projPublishTime.toDateString());
    $('.client').text('Client: ' + project.labels[0]);
    $('.category').text('Category: ' + project.labels[1]);
    $('.proj-link').attr('href',`${project.link}`);
    $('.proj-link').html('Link to ' + project.title);
}

function sendMail() {
    const subject = $('.form-input').val();
    const body = $('.form-msg').val();
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=michaeleyvazov@gmail.com&su=${subject}&body=${body}`)
}