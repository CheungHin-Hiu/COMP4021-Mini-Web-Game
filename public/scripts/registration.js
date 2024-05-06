$(function(){

    $("#register-form").on("submit", (e) => {
        // Do not submit the form
        e.preventDefault();

        // Get the input fields
        const username = $("#register-username").val().trim();
        const password = $("#register-password").val().trim();
        const confirmPassword = $("#register-confirm").val().trim();

        // Password and confirmation does not match
        if (password != confirmPassword) {
            $("#register-message").text("Passwords do not match.");
            return;
        }

        // Send a register request
        Registration.register(username, password,
            () => {
                $("#register-form").get(0).reset();
                $("#register-message").text("You can sign in now.");
            },
            (error) => { $("#register-message").text(error); }
        );
    });

    const Registration = (function() {
        // This function sends a register request to the server
        // * `username`  - The username for the sign-in
        // * `password`  - The password of the user
        // * `onSuccess` - This is a callback function to be called when the
        //                 request is successful in this form `onSuccess()`
        // * `onError`   - This is a callback function to be called when the
        //                 request fails in this form `onError(error)`
        const register = function(username, password, onSuccess, onError) {
    
            //
            // A. Preparing the user data
            //
            const data = JSON.stringify({  username, password });
            //
            // B. Sending the AJAX request to the server
            //
            fetch("/register",{
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: data
    
            }) // -> check  if the data is sent to backend in F12 network
            .then((res) => {
                return res.json(); // transfer json to js obj
            })
            .then((json) => {
                console.log(json)
                //
                // F. Processing any error returned by the server
                //
                if(json.status === "error"){
                    if (onError) {
                        onError(json.error);
                    }
                }
                //
                // J. Handling the success response from the server
                //
                if(json.status === "success"){
                    if(onSuccess){
                        onSuccess(); // this will output you can sign in now
                    }
                    window.location.href = "./signin.html";
                }
            }) 
     
            // Delete when appropriate
        };
    
        return { register };
    })();
    


})