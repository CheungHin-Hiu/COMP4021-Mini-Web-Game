$(function(){
    $("#signin-form").on("submit", (e) => {
        // Do not submit the form
        e.preventDefault();
    
        // Get the input fields
        const username = $("#signin-username").val().trim();
        const password = $("#signin-password").val().trim();
    
        // Send a signin request
        Authentication.signin(username, password,
            () => {
                // hide();
                // UserPanel.update(Authentication.getUser());
                // UserPanel.show();
                window.location.href = "./main_screen.html";
            },
            (error) => { $("#signin-message").text(error); }
        );
    });
    
    
})


const Authentication = (function() {
    // This stores the current signed-in user
    let user = null;

    // This function gets the signed-in user
    const getUser = function() {
        return user;
    }

    // This function sends a sign-in request to the server
    // * `username`  - The username for the sign-in
    // * `password`  - The password of the user
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signin = function(username, password, onSuccess, onError) {

        //
        // A. Preparing the user data
        //
        const data = JSON.stringify({username, password})
        //
        // B. Sending the AJAX request to the server
        //
        fetch("/signin",{
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: data
        })
        .then((res) => {return res.json()})
        .then((result) => {
            console.log("result.status", result.status)
            if(result.status === "error"){
                //
                // F. Processing any error returned by the server
                //
                if (onError) {
                    onError(result.error);
                }
            } 
            if(result.status === "success"){
                //
                // H. Handling the success response from the server
                //
                user = result.user
                if(onSuccess){
                    onSuccess(); // this will output you can sign in now
                }
            }
        })


  
    };

    // This function sends a validate request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const validate = function(onSuccess, onError) {

        //
        // A. Sending the AJAX request to the server
        //
        fetch("/validate")
        .then((res) => {
            return res.json()
        })
        .then((result) => {
            if(result.status === "error"){
                //
                // C. Processing any error returned by the server
                //

                if (onError) {
                    onError(result.error);
                }
            } 
            if(result.status === "success"){
                //
                // E. Handling the success response from the server
                //
                user = result.user
                if(onSuccess){
                    onSuccess(); // this will output you can sign in now
                }
            }
        })

       


        // Delete when appropriate
    };

    // This function sends a sign-out request to the server
    // * `onSuccess` - This is a callback function to be called when the
    //                 request is successful in this form `onSuccess()`
    // * `onError`   - This is a callback function to be called when the
    //                 request fails in this form `onError(error)`
    const signout = function(onSuccess, onError) {
        fetch("/signout")
        .then((res) => res.json())
        .then((result) => {
            if(result.status === "success"){
                user = null
                if(onSuccess){
                    onSuccess(); // this will output you can sign in now
                }
            }
        })
        // Delete when appropriate
        if (onError) onError("This function is not yet implemented.");
    };

    return { getUser, signin, validate, signout };
})();
