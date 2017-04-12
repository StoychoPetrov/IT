$( document ).ready(function() { 
	function Book(title,authors,theme,price,year){
		this.title 		= title;
		this.authors	= authors;
		this.theme		= theme;
		this.price		= price;
		this.year		= year;
	}

	var books = [];
	var cheapBook;
	var expensiveBook;
    var isEditPressed   = false;
    var selectedBook;
    var editIndex;

	  $.get("catalog_second.xml", {}, function (xml){
              $('book',xml).each(function(i){
                 var title 	= $(this).find("title").text();
                 var theme	= $(this).find("theme").text();
                 var price	= $(this).find("price").text();
                 var year	= $(this).find("year").text();
                 var authors = [];
                 $(this).find("author").each(function(j,v){
                 	authors.push($(v).text());
                 });



                 var book = new Book(title,authors,theme,price,year);
                 books.push(book);

                 if(cheapBook == null || parseFloat(price.substr(1)) < parseFloat(cheapBook.price.substr(1)))
                 	cheapBook = book;
                 if(expensiveBook == null || parseFloat(price.substr(1)) > parseFloat(expensiveBook.price.substr(1)))
                 	expensiveBook = book;

                 var authorNames = "";
                 var i = 0;
                 authors.forEach(function(element){
                 	if(i < authors.length - 1)
                     	authorNames += element + ", ";
                    else
                     	authorNames += element;
                    i++;
                 });
                 	
               
                 $("table tbody").append("<tr><td>"+ title +"</td><td>" + authorNames +"</td><td>" + 
                 	theme + "</td><td>" + price + "</td>" + "<td>" + year + "</td><td><button id=\"a\">DELETE</button></td><td><button id=\"edit\" data-toggle=\"modal\" data-target=\"#myModal\">EDIT</button></td></tr>");

             });
              if(cheapBook != null && expensiveBook != null)
                 	document.getElementById("cheap_book").innerHTML = "The cheapest book is <b>" + cheapBook.title + "</b> for only <b>" + cheapBook.price + "</b><br> The most expensive book is <b>" + expensiveBook.title +"</b> for <b>" + expensiveBook.price +"</b>";
          });

      $("#add").click(function(){
          $('input').each(function(index,data) {
                 $(this).val("");
            });
      });

      $( "#save" ).click(function() {
            var title;
            var author;
            var theme;
            var price;
            var year;
           $('input').each(function(index,data) {
                var value = $(this).val();
                switch(index){
                    case 0:
                        title = value;
                        break;
                    case 1:
                        author = value;
                        break;
                    case 2:
                        theme = value;
                        break;
                    case 3:
                        price = value;
                        break
                    case 4:
                        year = value;
                        break;
                }
            });

           if(isEditPressed){
                isEditPressed = false;
               
                var book            = new Book(title,[author],theme,price,year);
                books[editIndex]    = book;
                refresh();
           }else{
                $("table tbody").append("<tr><td>"+ title +"</td><td>" + author +"</td><td>" + 
                theme + "</td><td>" + price + "</td>" + "<td>" + year + "</td><td><button id=\"a\">DELETE</button></td><td><button id=\"edit\" data-toggle=\"modal\" data-target=\"#myModal\">EDIT</button></td></tr>");
                books.push(new Book(title,[author],theme,price,year));
           }
           
        });

      $('table').on('click', '#a', function()
        {//replace table selector with an id selector, if you are targetting a specific table
            var row     = $(this).closest('tr'),
            cells       = row.find('td');
            btnCell     = $(this).parent();
            var index   = row[0].sectionRowIndex;
            document.getElementById("table").deleteRow(index);
            delete books[index];
        });

        $('table').on('click', '#edit', function()
        {//replace table selector with an id selector, if you are targetting a specific table
            var row         = $(this).closest('tr');
            editIndex       = row[0].sectionRowIndex;
            isEditPressed   = true;
            selectedBook    = books[editIndex];

            $('input').each(function(index,data) {
                switch(index){
                    case 0:
                        $(this).val(selectedBook.title);
                        break;
                    case 1:
                        $(this).val(selectedBook.authors[0]);
                        break;
                    case 2:
                        $(this).val(selectedBook.theme);
                        break;
                    case 3:
                        $(this).val(selectedBook.price);
                        break
                    case 4:
                        $(this).val(selectedBook.year);
                        break;
                }
            });
        });

        function refresh() {
            $("#th_body tr").remove();

            $.each(books, function( index, value ) {
                var book = books[index];

                 var authorNames = "";
                 var i = 0;
                 book.authors.forEach(function(element){
                    if(i < book.authors.length - 1)
                        authorNames += element + ", ";
                    else
                        authorNames += element;
                    i++;
                 });

                 $("table tbody").append("<tr><td>"+ book.title +"</td><td>" + authorNames +"</td><td>" + 
                    book.theme + "</td><td>" + book.price + "</td>" + "<td>" + book.year 
                    + "</td><td><button id=\"a\">DELETE</button></td><td><button id=\"edit\" data-toggle=\"modal\" data-target=\"#myModal\">EDIT</button></td></tr>");
            }); 
        }
});	