/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.test;

/**
 *
 * @author anoop
 */
public class UserAddress {
    private String value;
    private String state;
    private String city;
    private String zip;

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getValue() {
        return value;
    }

    public String getZip() {
        return zip;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setState(String state) {
        this.state = state;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public void setZip(String zip) {
        this.zip = zip;
    }
    
}
