$(document).ready(function() {
    $('select').material_select();
    $( "select.prefood" ).change(function() {
      var fid = $( "select.prefood option:selected").val();
      console.log(fid);
      console.log('Change selected');
      $.ajax({
        url: "/prefood/owner/" + fid ,
        type: 'PUT',
        success: () => {
          Materialize.toast('Change prefood success', 4000)
        },
        error: () => {
          Materialize.toast('Change prefood fail!!', 4000)
        }
      });
    });
});
