/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.test;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.Base;

/**
 *
 * @author anoop
 */
public class Home extends Base {

    @Override
    public void process(HttpServletRequest req, HttpServletResponse res) {
        Gson g = new Gson();
        User u = g.fromJson(req.getParameter("user"), User.class);
        try {
            res.getWriter().write(g.toJson(u));
        } catch (IOException ex) {
            Logger.getLogger(Home.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
