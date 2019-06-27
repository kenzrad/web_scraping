$(document).ready(function () {
  getArticles();
});


//
//  CLICKS
//

$("#refresh").on("click", function() {
  scrapeArticles();
});

$(document).on("click", ".article", function(e) {
  e.stopPropagation();
  if (!$("#notes").hasClass("hidden")) {
    $("#notes").addClass("hidden")
  }
  else {
    $("#notes").removeClass("hidden")
    $("#notes").empty()
    let thisId = $(this).attr("data-id");
    showNotes(thisId);
  }
});

$(document).on("click", ".saveNoteBtn", function() {
  let thisId = $(this).attr("data-id");
  saveNote(thisId)
});

$(document).on("click", ".hideNotes", function(e) {
  e.stopPropagation();
  if (!$("#notes").hasClass("hidden")) {
    $("#notes").addClass("hidden")
  }
});

//
//  FUNCTIONS
//

//add new articles to the database (if there are any new articles), you won't loose articles already there
scrapeArticles = () => {
  $.get("/scrape", function (data) {
    console.log("scrape complete");
    getArticles();
  });
}

getArticles = () => {
  $.get("/articles", function (data) {
    data.forEach (function(datum) {
      $("#articles").append(
        `<div class='row article-row>
          <a class='article' href='${datum.link}' 'data-id='${datum._id}'>
            <p class='article-link p-2 ml-3'>${datum.title}</p>
            <a data-id='${datum._id}' class='article'><i class="far fa-edit noteBtn pt-2 pl-2"></i></a>
          </a>
        </div>
      `);
    });
  });
}

showNotes = (thisId) => {
  $.ajax({
    method: `GET`,
    url: `/articles/${thisId}`
  })
    .then(function(data) {
      let notes = data.note
      $("#notes").append(
        `<div class='d-flex align-items-end flex-column'>
          <a class='btn btn-sm hideNotes py-0 px-1'>X</a>
        </div>
        <div class='title-div mb-2'>
          <h5>${data.title}</h5>
        </div>
       
      `);

    // If there's a note in the article
    if (notes.length > 0) {
      notes.forEach(function(note) {
        $("#notes").append(
        `<div class='note-row row'>
        <div class='col-10'>
        <p id='bodyinput' name='body' class='notes-text'>${note.body}</p>
        </div>
        <div class='col-2'>
        <a data-id='${note._id}' class='editNoteBtn'><i class="far fa-edit"></i></a>
        <a data-id='${note._id}' class='deleteNoteBtn'><i class="far fa-trash-alt"></i></a>
        </div>
        </div>
        `);
      });
      $("#notes").append(`<button class='newNoteBtn'>New</button>`);
    }
    else  {
      $("#notes").append(
      `<textarea class='bodyinput' name='body'></textarea>
      <button data-id='${data._id}' class='saveNoteBtn'>Save</button>
      `);
    }
    $(".notes-container").show()
  });
};

saveNote = (thisId) => {
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $(".titleinput").val(),
      body: $(".bodyinput").val()
    }
  })
    .then(function(data) {
      $("#notes").empty();
    });

  $(".titleinput").val("");
  $(".bodyinput").val("");
};





