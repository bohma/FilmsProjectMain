 // Получение всех фильмов
 function GetFilms() {
    $.ajax({
        url: "/api/films",
        type: "GET",
        contentType: "application/json",
        success: function (films) {
            var rows = "";
            $.each(films, function (index, film) {
                // добавляем полученные элементы в таблицу
                rows += row(film);
            })
            $("table tbody").append(rows);
         }
    });
}
// Получение одного фильма по id
function GetFilm(id) {
    $.ajax({
        url: "/api/films/"+id,
        type: "GET",
        contentType: "application/json",
        success: function (film) {
            var form = document.forms["filmForm"];
            form.elements["id"].value = film._id;
            form.elements["title"].value = film.title;
            form.elements["date"].value = film.date;
            form.elements["format"].value = film.format;
            form.elements["stars"].value = film.stars.split(', ');
        }
    });
}
// Получение одного фильма по title
function GetFilmTitle(title) {
    $.ajax({
        url: "/api/films/"+title,
        type: "GET",
        contentType: "application/json",
        success: function (film) {
            var form = document.forms["filmForm"];
            form.elements["id"].value = film._id;
            form.elements["title"].value = film.title;
            form.elements["date"].value = film.date;
            form.elements["format"].value = film.format;
            form.elements["stars"].value = film.stars.split(', ');
        }
    });
}

//Сортировка фильмов в алафитном порядке
function sortByTitle() {
    $.ajax({
            url: "/api/films",
            type: "GET",
            contentType: "application/json",
            success: function (films) {
                films = films.sort((a, b) => a.title > b.title ? 1 : -1);
                var rows = "";
                $.each(films, function (index, film) {
                    // добавляем полученные элементы в таблицу
                    rows += row(film);
                })
                $("table tbody").append(rows);
            }
        });
    }
// Добавление фильма
function CreateFilm(filmTitle, filmDate, filmFormat, filmStars) {
    $.ajax({
        url: "api/films",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            title: filmTitle,
            date: filmDate,
            format: filmFormat,
            stars: filmStars.split(', ')
        }),
        success: function (film) {
            reset();
            $("table tbody").append(row(film));
        }
    })
}
// Изменение фильма
function EditFilm(filmId, filmTitle, filmDate , filmFormat, filmStars) {
    $.ajax({
        url: "api/films",
        contentType: "application/json",
        method: "PUT",
        data: JSON.stringify({
            id: filmId,
            title: filmTitle,
            date: filmDate,
            format: filmFormat,
            stars: filmStars
        }),
        success: function (film) {
            reset();
            console.log(film);
            $("tr[data-rowid='" + film._id + "']").replaceWith(row(film));
        }
    })
}

// сброс формы
function reset() {
    var form = document.forms["filmForm"];
    form.reset();
    form.elements["id"].value = 0;
}

// Удаление фильма
function DeleteFilm(id) {
    $.ajax({
        url: "api/films/"+id,
        contentType: "application/json",
        method: "DELETE",
        success: function (film) {
            console.log(film);
            $("tr[data-rowid='" + film._id + "']").remove();
        }
    })
}
// создание строки для таблицы
var row = function (film) {
    return "<tr data-rowid='" + film._id + "'><>" + "<td><a class = 'filmLink'"+ film._id + "' href = '/api/films/"+ film._id +"'>" + film.title + "</a></td> <td>" + film.date + "</td> <td>" + film.format + "</td> <td>" + film.stars +"</td>" +
           "<td><a class='editLink' data-id='" + film._id + "'>Изменить</a> | " +
            "<a class='removeLink' data-id='" + film._id + "'>Удалить</a></td></tr>";
}
// сброс значений формы
$("#reset").click(function (e) {

    e.preventDefault();
    reset();
})

// отправка формы
$("form").submit(function (e) {
    e.preventDefault();
    var id = this.elements["id"].value;
    var title = this.elements["title"].value;
    var date = this.elements["date"].value;
    var format = this.elements["format"].value;
    var stars = this.elements["stars"].value
    if (id == 0)
        CreateFilm(title, date, format, stars);
    else
        EditFilm(id, title, date, format, stars);
});

// нажимаем на ссылку Изменить
$("body").on("click", ".editLink", function () {
    var id = $(this).data("id");
    GetFilm(id);
})
// нажимаем на ссылку Удалить
$("body").on("click", ".removeLink", function () {
    var id = $(this).data("id");
    DeleteFilm(id);
})

// загрузка фильмов
// GetFilms();

/*
function SearchFilmTitle(title) {
    $.ajax({
        url: "/api/films/"+title,
        type: "GET",
        contentType: "application/json",
        success: function (filmTitle) {
            let searchFilmForm = document.forms["searchFilmForm"];
            let filmTitle = searchFilmForm.elements["filmTitle"].value;
            let film_title = JSON.stringify({filmTitle: filmTitle});
            req.send(film_title);
        }
    });
}*/
//Поиск по названию
/*
document.getElementById("submit").addEventListener("click", function (e) {
    e.preventDefault();
   // получаем данные формы
   let searchFilmForm = document.forms["searchFilmForm"];
   let filmTitle = searchFilmForm.elements["filmTitle"].value;
   
   // сериализуем данные в json
   let film_title = JSON.stringify({filmTitle: filmTitle});
   let req = new XMLHttpRequest();
   // посылаем запрос на адрес "/film"
    req.open("POST", "/film", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function () {
       // получаем и парсим ответ сервера
        let receivedFilm = JSON.parse(req.res);
        console.log(receivedFilm.filmTitle);   // смотрим ответ сервера
    });
    req.send(film_title);
});
*/
/*function searchByTitle(filmTitle) {
    $.ajax({
        url: "/api/films/searchTitle/:"+filmTitle,
        contentType: "application/json",
        method: "GET",
        data: JSON.stringify({
            title: filmTitle
        }),
        success: function (film) {
            reset();
            $("table tbody").append(row(film));
        }
    })
}*/
/*
function searchByTitle() {
    $.ajax({
            url: "/api/films/search",
            type: "POST",
            contentType: "application/json",
            success: function (films) {
            filmsDb.films.find({
                title:{
                    $regex: new RegExp(title,'ig')
                },function(err,doc){
                    
                }});
                var rows = "";
                $.each(films, function (index, film) {
                    // добавляем полученные элементы в таблицу
                    rows += row(film);
                })
                $("table tbody").append(rows);
            }
        });
    }*/