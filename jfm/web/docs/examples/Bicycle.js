/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

fm.Class("Bicycle");
Bicycle  = function(){
    var cadence = 0;
    var speed = 0;
    var gear = 1;
    this.changeCadence = function(newValue) {
        cadence = newValue;
    };
    this.changeGear = function(newValue) {
        gear = newValue;
    };
    this.speedUp = function(increment) {
        speed = speed + increment; 
    };
    this.applyBrakes = function(decrement) {
        speed = speed - decrement;
    };
    this.printStates = function() {
        alert("cadence:" +
            cadence + " speed:" + 
            speed + " gear:" + gear);
    }    
};
