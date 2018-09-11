var scores_per_page = 10;

class HighScoresViewer{

  constructor(){
    this.json_caller = new HighScoresJSON();
    this.rows_val = 0;
    this.cols_val = 0;
    this.mines_val = 0;
    this.cur_page = 1;

    for(var i = 0; i < scores_per_page; i++){
      var new_row = document.getElementById('hs_table').insertRow(i+1);
      for(var j = 0; j < 4; j++){
        new_row.insertCell(j);
      }
      new_row.childNodes[0].style.backgroundColor = "royalblue";
      //new_row.childNodes[1].innerHTML = "aaaa";
      //new_row.childNodes[0].setAttribute('width', '10%');
    }
  }

  set_rows_val(rows){
    this.rows_val = rows;
  }

  set_cols_val(cols){
    this.cols_val = cols;
  }

  set_mines_val(mines){
    this.mines_val = mines;
  }

  initialize(){
    var callback = $.Deferred();

    this.set_rows_val(8);
    this.set_cols_val(8);
    this.set_mines_val(10);

    $.when(this.json_caller.pullScores()).done(
      () => {
        this.set_page(1);
        callback.resolve();
      }
    ).fail(
      (information) => {
        callback.reject(information);
      }
    )

    return callback.promise();

  }

  display_scores(){
    var table = document.getElementById("hs_table");
    var scores = this.json_caller.getScores(this.rows_val, this.cols_val, this.mines_val, (this.cur_page-1)*scores_per_page, scores_per_page);
    for(var i = 0; i < scores.data.length; i++){
      table.childNodes[1].childNodes[i+2].childNodes[0].innerHTML = i+1+(this.cur_page-1)*scores_per_page;
      table.childNodes[1].childNodes[i+2].childNodes[1].innerHTML = scores.data[i].name;
      table.childNodes[1].childNodes[i+2].childNodes[2].innerHTML = scores.data[i].time;
      table.childNodes[1].childNodes[i+2].childNodes[3].innerHTML = scores.data[i].percent + "%";
    }
    for(var i = scores.data.length; i < scores_per_page; i++){
      for(var j = 0; j < 4; j++){
        table.childNodes[1].childNodes[i+2].childNodes[j].innerHTML = i+1+(this.cur_page-1)*scores_per_page;
      }
    }
  }

  next_page(){
    this.set_page(this.cur_page+1);
  }

  prev_page(){
    this.set_page(this.cur_page-1);
  }

  set_page(page_num){
    this.cur_page = page_num
    this.display_scores();
    if(page_num == 1){
      document.getElementById('prev_hs_page').setAttribute('disabled', true);
    }
    else{
      document.getElementById('prev_hs_page').removeAttribute('disabled');
    }
    if(this.json_caller.getNumScores(this.rows_val, this.cols_val, this.mines_val) <= page_num*scores_per_page){
      document.getElementById('next_hs_page').setAttribute('disabled', true);
    }
    else{
      document.getElementById('next_hs_page').removeAttribute('disabled');
    }
  }
}
