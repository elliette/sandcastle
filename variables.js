/* 
To run Sandcastle in a development environment, comment out the `deployed variables` and un-comment out the `production variables`. 

WHEN YOU PUSH TO MASTER, BE SURE TO COMMENT THE DEPLOYMENT VARIABLES BACK IN, AND THE PRODUCTION VARIABLES OUT!!!
	

	====================
	DEPLOYMENT VARIABLES
	====================  */


const postgresPath = 'postgres://sandcastles:sandcastles@localhost:5432/sandcastles'

const appURL = 'http://www.sandcastle.world'; 


/*  ====================
	PRODUCTION VARIABLES
	====================  */


// const postgresPath = 'postgres://localhost:5432/sandcastle' 

// const appURL = 'http://localhost:3000';


module.exports = {
  	postgresPath,
  	appURL
};
