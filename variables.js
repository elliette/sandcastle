/*  ====================
	PRODUCTION VARIABLES 
	====================  */ 


// const postgresPath = 'postgres://localhost:5432/sandcastle'; 

// const dockerCmd = 'docker'; 

// const ipAddress = 'http://localhost:8080'; 

// const appURL = 'http://localhost:3000';

// const const dockerComposeCmd = 'docker-compose'; 



/*  ====================
	DEPLOYED VARIABLES 
	====================  */ 

const postgresPath = 'postgres://sandcastles:sandcastles@localhost:5432/sandcastles'

const dockerCmd = 'sudo docker'; 

const dockerComposeCmd = 'sudo docker-compose'; 

const ipAddress = '104.236.111.206'; 

const appURL = 'http://www.sandcastle.world'; 



module.exports = { 
	postgresPath, 
	dockerCmd, 
	dockerComposeCmd,  
	ipAddress
}; 