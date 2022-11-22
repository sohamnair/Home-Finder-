function validateRegistration(email,password,firstName,lastName,contact,gender,city,state,age){
    if(!email || !password||!firstName){
      throw "Input not provided";
    }
    if(typeof email!=='string' || typeof password!=='string' || typeof firstName!=='string'|| typeof lastName!=='string'|| typeof contact!=='string'|| typeof gender!=='string'|| typeof city!=='string'|| typeof state!=='string'|| typeof age!=='string'){
      throw "Input must be string";
    }
    if(email.trim().length==0 || password.trim().length==0|| firstName.trim().length==0|| lastName.trim().length==0|| contact.trim().length==0|| gender.trim().length==0|| city.trim().length==0|| state.trim().length==0|| age.trim().length==0){
      throw "Input cannot be Empty spaces";
    }
    if(!((/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/).test(email.trim()))){
      throw "Invalid email";
    }
    if(!((/^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.* ).{6,}$/).test(password))){
      throw "Password should have at least one uppercase character, at least one number, at least one special character and at least 6 characters long";
    }
    if(!((/^[a-zA-Z]{2,}$/).test(firstName.trim()))){
        throw "only letters in firstname, min two characters";
    }
    if(!((/^[a-zA-Z]{2,}$/).test(lastName.trim()))){
        throw "only letters in lastname, min two characters";
    }
    if(!((/^[0-9]{10,10}$/).test(contact.trim()))){
        throw "only numbers in contact, ten characters";
    }
    if(!((/^(M|F)$/).test(gender.trim()))){
        throw "only letters in gender";
    }
    if(!((/^[a-zA-Z]{4,}$/).test(city.trim()))){
        throw "only letters in city, min four characters";
    }
    if(!((/^[a-zA-Z]{2,}$/).test(state.trim()))){
        throw "only letters in state, min two characters";
    }
    if(!((/^[0-9][0-9]$/).test(age.trim()))){
        throw "only numbers in age, two characters";
    }
}

function validateUser(email,password){
    if(!email || !password){
        throw "Input not provided";
    }
    if(typeof email!=='string' || typeof password!=='string'){
        throw "Input must be string";
    }
    if(email.trim().length==0 || password.trim().length==0){
        throw "Input cannot be Empty spaces";
    }
    if(!((/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/).test(email.trim()))){
        throw "Invalid email";
    }
    if(!((/^(?=.*[0-9])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.* ).{6,}$/).test(password))){
        throw "Password should have at least one uppercase character, at least one number, at least one special character and at least 6 characters long";
    }
}

function validateEmail(email){
    if(!email){
        throw "Input not provided";
    }
    if(typeof email!=='string'){
        throw "Input must be string";
    }
    if(email.trim().length==0){
        throw "Input cannot be Empty spaces";
    }
    if(!((/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/).test(email.trim()))){
        throw "Invalid email";
    }
}

function validateProperty(address,description,laundry,rent,listedBy,email,area,bed,bath){
    if(!address||!description||!laundry||!rent||!listedBy||!email||!area||!bed||!bath){
        throw "Error: Input missing";
    }
    if(typeof address!=='string'||typeof description!=='string'||typeof laundry!=='string'||typeof rent!=='string'||typeof listedBy!=='string'||typeof email!=='string'||typeof area!=='string'||typeof bed!=='string'||typeof bath!=='string'){
        throw "Error : input not string";
    }
    if(address.trim().length==0||description.trim().length==0||laundry.trim().length==0||rent.trim().length==0||listedBy.trim().length==0||email.trim().length==0||area.trim().length==0||bed.trim().length==0||bath.trim().length==0){
        throw "Error : input cannot be empty spaces"
    }
    
    address=address.trim()
    description=description.trim()
    laundry=laundry.trim()
    rent=rent.trim()
    listedBy=listedBy.trim()
    email=email.trim()
    area=area.trim()
    bed=bed.trim()
    bath=bath.trim()

    if(!((/^[0-9]+$/).test(rent))){
        throw "rent should be only numbers"
    }
    if(!((/^[0-9]+$/).test(area))){
        throw "rent should be only numbers"
    }
    if(!((/^[0-9]+$/).test(bed))){
        throw "rent should be only numbers"
    }
    if(!((/^[0-9]+$/).test(bath))){
        throw "rent should be only numbers"
    }

    rent=Number(rent);
    area=Number(area);
    bed=Number(bed);
    bath=Number(bath);
    if(rent==NaN|| area==NaN|| bed==NaN|| bath==NaN){
        throw "Error : input not a number";
    }
    if(!((/^[0-9]{1,4}[a-zA-Z, ]+[0-9]+$/).test(address))){
        throw "Error : Invalid address";
    }
    if(!((/^[a-zA-Z0-9 ,\.]+$/).test(description))){
        throw "Error : Invalid description";
    }
    if(!((/^[a-zA-Z- ]+$/).test(laundry))){
        throw "Error: Invalid laundry";
    }
    if(!((/^[a-zA-Z ]$/).test(listedBy))){
        throw "Error : Invalid lister";
    }
    if(!((/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/).test(email.trim()))){
        throw "Invalid email";
    }
}

module.exports={
  validateRegistration,
  validateUser,
  validateProperty,
  validateEmail
}