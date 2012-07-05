/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
fm.Package("user");
fm.Class("User");
user.User = function(){
    this.toArray = function(){
        var userarr = [
        this.firstName,
        this.lastName,
        this.companyName,
        this.suite,
        this.address,
        this.phone,
        this.comptype,
        this.org,
        this.fromwhere, 1];
        return userarr;
    };
    this.User = function(obj){
        this.firstName = obj.firstName || obj.firstname;
        this.lastName = obj.lastName || obj.lastname;
        this.companyName = obj.companyName || obj.companyname;
        this.suite = obj.suite;
        this.address = obj.address;
        this.phone = obj.phone;
        this.email = obj.email;
        this.comptype = obj.comptype;
        this.org = obj.org;
        this.fromwhere = obj.fromwhere;
    }    
};