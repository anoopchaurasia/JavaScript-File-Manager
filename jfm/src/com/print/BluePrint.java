/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.print;

import com.google.gson.Gson;
import java.util.HashMap;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.Base;

/**
 *
 * @author anoop
 */
public class BluePrint extends Base{

    private HashMap<String, String> print;

    public BluePrint() {
        print = new HashMap<String, String>();
        
    }
    
    public void add( String key, String value){
        print.put( key, value);
    }
    
    public String get( String key){
        return print.get(key);
    }
    
    public String getAll () {
        Gson g = new Gson();
        return g.toJson(print);
    }

    @Override
    public void process(HttpServletRequest request, HttpServletResponse response) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}

