/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author anoop
 */
public class ClientSystem extends Base {

    public static void out_print(HttpServletRequest req, HttpServletResponse resp) {
        System.out.print(req.getParameter("data"));
    }

    public static void err_print(HttpServletRequest req, HttpServletResponse resp) {
        System.err.print(req.getParameter("data"));
    }

    @Override
    public void process(HttpServletRequest request, HttpServletResponse response) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
