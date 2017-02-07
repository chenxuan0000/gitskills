(function($){
		
		
	$("#sc1").on("change", function(){

    var files1 = !!this.files ? this.files : [];
    if (!files1.length || !window.FileReader) return;
    if (/^image/.test( files1[0].type)){
        var reader1 = new FileReader();
        reader1.readAsDataURL(files1[0]);
        reader1.onloadend = function(){
       $(".sc1").css("background-image", "url("+this.result+")");
        }
    }
});
	
		
})(jQuery); 


