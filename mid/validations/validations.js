const router = require('express').Router();

//Validate TLD when recieved from params, query, & body
//Rule - TLD should be char || length should be in range [2, 4]
const validTLD = (req, res, next) => {
  try {
    let tld;
    if (req.params.tld) {
      tld = req.params.tld;
    } else if (req.body.tld) {
      tld = req.body.tld;
    } else if (req.query.tld) {
      tld = req.query.tld;
    } else {
      return res.status(400).send("TLD Value Not Found. TLD not found in request parameters, query parameters or body");
    }
    if(/^[a-zA-Z]{2,4}$/.test(tld)){
      next()
    }else{
      return res.status(400).send("Invalid TLD format. It should contain only characters and have a minimum of 2 and maximum length of 4.");
    }


  } catch (err) {
    return res.status(400).send(err)
  }
}


//Validate Page Number when recieved from params or query
//Rule - Page Number should start from 1 || 0 and negative numbers not allowed
const validPage = (req, res, next) => {
  try {
    let page;
    if( req.params.page ){
      page = req.params.page
    } else if( req.query.page ){
      page = req.query.page
    } else {
      return res.status(400).send("Page Value Not Found. Page value not given in request parameters or query parameters");
    }

    if (/^[0-9]+$/.test(page) && page >= 1) {
      next();
    } else {
      return res.status(400).send("Invalid Page format. Page field should be a valid positive number");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};


//Validate id 
//Rule - Contains Hexadecimal Values [0 to 9 and A to F] || length of 24 characters 
const validId = (req, res, next) => {
  try {
    const id = req.params.id

    if (/^[0-9a-fA-F]{24}$/.test(id) ) {
      next();
    } else {
      return res.status(400).send("Invalid ID format. Please provide a valid Id.");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};


//Validate roleId
//Rule - Role should in range [1 to 10]
const validRoleId = (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    if (!isNaN(id) && id >= 1 && id <= 10) {
      next();
    } else {
      return res.status(400).send("Invalid Role Id. Role ID should be a valid number between 1 and 10.");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};


//Validate Role with Id, Name, Description 
//Rule - Id should in range [1 to 10] only digits allowed
//Rule - Name should be lowercase or uppercase without any spaces
const validRole = (req, res, next) => {
  try {
    const {id, name} = req.body;
    if (typeof id !== 'number' || id < 1 || id > 10) {
        return res.status(400).send('Invalid Role ID. ID should be a valid number between 1 and 10' );
    }
    if (!/^[a-zA-Z]+$/.test(name)) {
        return res.status(400).send('Invalid Role Name. Role Name must contain only letters');
    }

    next()

  } catch (err) {
    return res.status(400).send(err);
  }
};


// Validation SignupInput
const validateSignupInput = (req, res, next) => {

  try {
    const { email, password, username } = req.body;

    // Validate email format ==> user@example.com || user@[192.168.0.1] || user@sub-domain.example.com || user@example.co.uk
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format' );
    }
  
    // At least one lowercase alphabet i.e. [a-z]
    // At least one uppercase alphabet i.e. [A-Z]
    // At least one Numeric digit i.e. [0-9]
    // At least one special character i.e. [‘@’, ‘$’, ‘.’, ‘#’, ‘!’, ‘%’, ‘*’, ‘?’, ‘&’, ‘^’, '_' , '-'] 
    // The total length must be in the range [8-65]
    const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\-@.#$!%*?&])[A-Za-z\d_\-@.#$!%*?&]{8,65}$/
    if (!passwordRegex.test(password)) {
        return res.status(400).send('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 numeric digit, 1 special character, and be 8 to 65 characters long.' );
    }
  
    
    //Validate Username 
    const usernameRegex = /^[A-Za-z0-9_\-]+$/;
    if (!usernameRegex.test(username)) {
        return res.status(400).send('Username must consist of only uppercase letters, lowercase letters, digits, underscores (_), and hyphens (-).');
    }
  
    next();
  } catch (err) {
    return res.status(400).send(err);
  }

};


// Validation LoginInput
const validateLoginInput = (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email format ==> user@example.com || user@[192.168.0.1] || user@sub-domain.example.com || user@example.co.uk
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return res.status(400).send('Invalid email format' );
    }
  
    // At least one lowercase alphabet i.e. [a-z]
    // At least one uppercase alphabet i.e. [A-Z]
    // At least one Numeric digit i.e. [0-9]
    // At least one special character i.e. [‘@’, ‘$’, ‘.’, ‘#’, ‘!’, ‘%’, ‘*’, ‘?’, ‘&’, ‘^’, '_' , '-'] 
    // The total length must be in the range [8-65]
    const passwordRegex =  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\-@.#$!%*?&])[A-Za-z\d_\-@.#$!%*?&]{8,65}$/
    if (!passwordRegex.test(password)) {
        return res.status(400).send('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 numeric digit, 1 special character, and be 8 to 65 characters long.');
    }
  
    next();
  } catch (err) {
    return res.status(400).send(err);
  }

};


//valid domain
//Rule - domain only contains lowercase and Uppercase and digits
const validDomain = (req, res, next) => {
  try {
    const domain = req.body.domain
    if(/^[a-zA-Z0-9]+$/.test(domain)){
      next()
    }else{
      return res.status(400).send("Invalid Domain. Domain must contain only Digits, Lowercase or Uppercase letters");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
}


//valid protocol
//Rule - Protocols only contains lowercase 
const validProtocol = (req, res, next) => {
  try {
    const protocol = req.body.protocol
    if(/^[a-z]+$/.test(protocol)){
      next()
    }else{
      return res.status(400).send("Invalid Protocol. Protocol must contain only Lowercase letters");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
}


const validStatusCode = (req, res, next) => {
  try {
    const code = parseInt(req.body.statusCode);
    if (!isNaN(code) && code >= 100 && code <= 599) {
      next();
    } else {
      return res.status(400).send("Invalid Status Code. Status Code should be a valid Status Code between 100 and 599.");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};



//Validate MetaTags
//Rule - Ensure that metaTags is an object. Then iterate each metaTag ensure / metaTags[key] => value/ must be string then validate the value - uppercase lowercase digits special characters 
const validateMetaTags = (req, res, next) => {
  try {
    const { metaTags } = req.body;
    
    // Ensure metaTags is provided and is an object
    if (!metaTags || typeof metaTags !== 'object') {
      return res.status(400).send('metaTags must be provided as an object' );
    }
    
    // Validate each metaTag value using regex
    for (const key in metaTags) {
      const value = metaTags[key];
      if (typeof value !== 'string') {
        return res.status(400).send( `MetaTag value for key '${key}' must be a string` );
      }
      
      // Regular expression to allow only characters, integers, and special characters
      const regex = /^[a-zA-Z0-9\s\.,!@#$%^&*()\-_+=~`{}[\]:;"'<>,.?\/|]*$/;
      
      // Test the value against the regex
      if (!regex.test(value)) {
        return res.status(400).send(`Invalid value for MetaTag '${key}'. Only characters, integers, and special characters are allowed.` );
      }
    }
    
    next(); 
  } catch (error) {
    return res.status(400).send(err);
  }
};


module.exports = {validTLD, validPage, validId, validRoleId, validRole, validateSignupInput, validateLoginInput, validDomain, validProtocol, validStatusCode, validateMetaTags}