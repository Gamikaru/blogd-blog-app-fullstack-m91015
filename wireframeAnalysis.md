For each of the wireframes, answer the following questions:
● What, if any, DATA is required from the backend to render the wireframe? Generate
documentation for any required API. If no dynamic data are required, indicate that.
● What, if any, ACTIONS is this wireframe responsible for? Button clicks and form
submissions often trigger logic that leverages the API layer. Generate documentation for
any required API. If no actions are required, indicate that.

key: 
NO DATA REQUIRED - NDR
DATA REQUIRED - DR

Login - /login
(ref codebloggs1)
	RENDER: NDR

	ACTIONS: sending fetch req to check for existing user and match form inputs with user data 


		form 
			validate(em (bonus: valid string structure), pw ), all required	
			
		login button 
            if inputs valid
                fetch req
                        if email AND pw MATCH 

                            login successful
                            navigate to home
                            
                            Sample server response to client:
                                {     
                                status:"ok",     
                                    data:{
                                        user:{
                                        first_name:"Brutus",
                                        last_name:"Conway",
                                        birthday:"1980-04-20T18:25:43.511Z",
                                        email:"brutus@happy.com",
                                        password:"Test123!",
                                        status:"I am loving living life!!!",
                                        auth_level:"basic"
                                    token: 
                                        }
                                    },
                                    message: "user logged in successfully"
                                }

                            

				        else if... "user not found"

                            (login failure)
                            modal error alert
                            reset form

				        else if... "pw incorrect"

                            (login failure)
                            modal error alert 
                            reset form

				        else 
					
					        (login failure)
					        modal error alert 
                            reset form
					
                            sample server response to client:
                            {
                            status: "400", 
                            message: "bad request"
                            }


			Else if inputs invalid
				modal error alert (error specific message with valid inputs)
                reset form 

				 


		
		register link 
			nav to registration page


Registration - /registration


	RENDER: NDR
	
	ACTIONS: sending fetch request with new user details to be validated/added to DB

		form 
			validate(fn, ln, em (bonus: valid string structure), bd (date picker), pw, occu, loc), all required

		register button 
            if inputs valid			
                fetch req: send form content for validation/submission
                    if SUCCESS
                        
                        Sample server response to client:
                            {     
                            status:"ok",     
                                data:{
                                    user:{
                                    first_name:"Brutus",
                                    last_name:"Conway",
                                    birthday:"1980-04-20T18:25:43.511Z",
                                    email:"brutus@happy.com",
                                    password:"Test123!",
                                    status:"",
                                    auth_level:"basic"
                                
                                    }
                                },
                                message: "new user created successfully"
                            }

                    else if... "user exists"

                        registration failed


                    else if... "network issue"

                        registration failed


                    else if FAIL
                        
                        registration failed
                        show modal error alert
                        reset form 
                        
                        sample server response to client:
                            {
                                status: "409", 
                                message: "user already exists"
                            }       

        Else if inputs invalid
            registration failed
            modal alert with error message
            reset form 

			

			
				

>Header

>Nav-Bar

>Main 
    >>Home
        >>>User section -
        >>>post list 

    >>Bloggs

    >>Network

    >>Admin

    >>Post Modal OnClick()


>draw three identical squares using turtle.py
    >>xyz
    >>xyz


