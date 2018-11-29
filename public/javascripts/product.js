var ProductComponent = (function (window, undefined) {

  function ProductComponent () {
    // variable initialization

    this.init = function () {
      initializeElements();
    };
    // elements initialization
    var initializeElements = function () {
      confirmBuyHandler();
    };

    var confirmBuyHandler = function (){
      $('.confirmBuyHandler').on('click', function (e){
        // e.preventDefault();
        // console.log('conf')
      });
    }

  };

  return ProductComponent;

})(window);
