/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net;

import com.google.gson.Gson;
import com.test.Home;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author anoop
 */
public class Server extends Base {

    Chat chat;
    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException {
        PrintWriter out = null;
        try {
            String method = request.getParameter("method");
            if (method == null) {
                method = "process";
            }
            out = response.getWriter();
            if (method.equals("getData")) {

           //     chat.getDataFromFile(response.getWriter(), Long.parseLong(request.getParameter("timeStamp")));
            } else if (method.equals("setData")) {
               // chat.setDataToFile(request.getParameter("data"));
            } else if (method.equals("home")) {
                Gson g = new Gson();
                Home h = g.fromJson(request.getParameter("data"), Home.class);

            } else if (method.equals("print")) {
               // ClientSystem.print(request.getParameter("data"));
            } else if (method.equals("println")) {
                //ClientSystem.println(request.getParameter("data"));
            } else if (method.equals("getTemplate")) {
               // Template.getTemplate(response, request.getParameter("data"));
            }
        } catch (IOException ex) {

            ex.printStackTrace();
        } finally {
            out.close();
        }
    }
 
    public Server() {
        chat = new Chat();
    }

    @Override
    public void process(HttpServletRequest request, HttpServletResponse response) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
