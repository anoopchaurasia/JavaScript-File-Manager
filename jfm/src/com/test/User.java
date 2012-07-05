/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.test;

/**
 *
 * @author anoop
 */
public class User {

    private String firstName;
    private String lastName;
    private String email;
    private UserAddress address;
    private String comptype;
    private String org;
    private String fromwhere;

    public void setComptype(String comptype) {
        this.comptype = comptype;
    }

    public void setFromwhere(String fromwhere) {
        this.fromwhere = fromwhere;
    }

    public void setOrg(String org) {
        this.org = org;
    }

    public String getComptype() {
        return comptype;
    }

    public String getFromwhere() {
        return fromwhere;
    }

    public String getOrg() {
        return org;
    }

    public void setAddress(UserAddress address) {
        this.address = address;
    }

    public UserAddress getAddress() {
        return address;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
}
