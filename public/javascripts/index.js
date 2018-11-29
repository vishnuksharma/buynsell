(function ($) {
  $.fn.serializeFormJSON = function () {

      var o = {};
      var a = this.serializeArray();
      $.each(a, function () {
          if (o[this.name]) {
              if (!o[this.name].push) {
                  o[this.name] = [o[this.name]];
              }
              o[this.name].push(this.value || '');
          } else {
              o[this.name] = this.value || '';
          }
      });
      return o;
  };
})(jQuery);

var Registration = (function (window, undefined) {

  function Registration () {
    // variable initialization

    this.init = function () {
      initializeElements();
    };
    // elements initialization
    var initializeElements = function () {
      initializeComponent();
    };

    var initializeComponent = function () {
      saveRegistration();
      loginUser();
      updateUserProfile();
      saveProduct();
      openMobileMenu();
    };
    var openMobileMenu = function (){

      document.getElementsByClassName('navbar-toggler')[0].addEventListener('click', function (){   
       var ele = document.getElementById('navbarSupportedContent')
      //  console.log(ele.classList);
       var hasClass = ele.classList.contains('collapse');
       if (hasClass){
         ele.classList.remove("collapse");
      } else {
        ele.classList.add("collapse");
       }

      });
    }
    var updateUserProfile = function () {
      $('form.userProfile').on('submit', function (e){
        e.preventDefault();
        $('.error, .success').addClass('d-none');
        var formData = $('form.userProfile').serializeFormJSON();
        if (formData.password === "" || formData.password !== formData.cpassword){
          $('.error').removeClass('d-none');
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false;
        }
        // delete formData.cpassword;
        var resReg = postData('/users/userupdate/'+formData.id, formData, 'POST');
        resReg.then(
          function(response) {
            console.log(response);
            if (response.status !== 200) {
              $('.error').removeClass('d-none').html(response.message);
              $("html, body").animate({ scrollTop: 0 }, "slow");
              return;
            }
            // Examine the text in the response
            $('.success').removeClass('d-none').html(response.message);
            $("html, body").animate({ scrollTop: 0 }, "slow");
          }
        )
      });
    }
    var loginUser = function () {
      $('form.loginForm').on('submit', function (e){
        e.preventDefault();
        $('.error-reg').addClass('d-none');
        var formData = $('form.loginForm').serializeFormJSON();
        var resReg = postData('/users/login', formData, 'POST');
        resReg.then(
          function(response) {
            if (response.status !== 200) {
              $('.error-reg').removeClass('d-none').html(response.message);
              $("html, body").animate({ scrollTop: 0 }, "slow");
              return;
            }
            // Examine the text in the response
            window.location.href = '/products/products';
          }
        );
      });
    }
    var saveRegistration = function (){
      $('form.registerForm').on('submit', function (e){
        e.preventDefault();
        $('.alert').addClass('d-none');
        var formData = $('form.registerForm').serializeFormJSON();
        if (formData.password === "" || formData.password !== formData.cpassword){
          $('.error').removeClass('d-none');
          $("html, body").animate({ scrollTop: 0 }, "slow");
          return false;
        }
        // delete formData.cpassword;
        var resReg = postData('/users/register', formData, 'POST');
        resReg.then(
          function(response) {
            if (response.status !== 200) {
              $('.error-reg').removeClass('d-none').html(response.message);
              $("html, body").animate({ scrollTop: 0 }, "slow");
              return;
            }
            // Examine the text in the response
            $('.success-reg').removeClass('d-none').html(response.message+` click <a href"users/login">login</a>`);
            document.getElementById("registerForm").reset();
            $("html, body").animate({ scrollTop: 0 }, "slow");
          }
        )
      });
    }

    var saveProduct = function (){
      $('form.productForm').on('submit', function (e){
        e.preventDefault();
        $('.alert').addClass('d-none');
        var formData = $('form.productForm').serializeFormJSON();
        console.log(formData);
        var resProduct = postData('/products/add', formData, 'POST');
        resProduct.then(
          function(response) {
            if (response.status !== 200) {
              $('.error').removeClass('d-none').html(response.message);
              $("html, body").animate({ scrollTop: 0 }, "slow");
              return;
            }
            // Examine the text in the response
            $('.success').removeClass('d-none').html(response.message);
            $("html, body").animate({ scrollTop: 0 }, "slow");
          }
        )
      });
    }

    var postData = function (url, data, method='POST') {
        return fetch(url, {
          method: method, // *GET, POST, PUT, DELETE, etc.
          headers: {
              "Content-Type": "application/json; charset=utf-8"
          },        
          body: JSON.stringify(data), // body data type must match "Content-Type" header
      })
      .then( function (response) {return response.json()})
      .catch(function(err) {
        console.log('Fetch Error :-S', err);
      });
    };

  };

  return Registration;

})(window);

var registration = new Registration();
var productC = new ProductComponent();
window.onload = function(){
  registration.init();
  productC.init();
}
