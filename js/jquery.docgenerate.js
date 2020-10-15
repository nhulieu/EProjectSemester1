(function ($) {
    // Local storage check 
    // document.getElementById("download").addEventListener("click", function(event){
    //     $.shoppingcartuser("download");
    // });


    function Export2Doc(element, filename = ''){
        var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
        var postHtml = "</body></html>";
        var content = document.getElementById(element).cloneNode(true);
        content.getElementsByClassName("product-images")[0].remove();
        var html = preHtml+content.innerHTML+postHtml;
    
        var blob = new Blob(['\ufeff', html], {
            type: 'application/msword'
        });
        
        // Specify link url
        var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
        
        // Specify file name
        filename = filename?filename+'.doc':'document.doc';
        
        // Create download link element
        var downloadLink = document.createElement("a");
    
        document.body.appendChild(downloadLink);
        
        if(navigator.msSaveOrOpenBlob ){
            navigator.msSaveOrOpenBlob(blob, filename);
        }else{
            // Create a link to the file
            downloadLink.href = url;
            
            // Setting the file name
            downloadLink.download = filename;
            
            //triggering the function
            downloadLink.click();
        }
        
        document.body.removeChild(downloadLink);
    }

    var methods = {
        download : function () {            
            var productName = document.getElementById("buynow").getAttribute("data-name");
            document.getElementById("buynow").hidden = true;
            Export2Doc("product-summary", productName);
            document.getElementById("buynow").hidden = false;
        }
    }

    $.shoppingcartuser = function (method) {
        // Method call logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' not exist in jQuery.shoppingcartuser');
        }
    };

})(jQuery);    