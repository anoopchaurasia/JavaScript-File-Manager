/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net;

import java.io.*;
import java.util.Calendar;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author anoop
 */
public class Chat extends Base{

    long timeStamp;

    public void getDataFromFile(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        
        //long t = Long.parseLong( req.getParameter("timeStamp"));
        PrintWriter writer = resp.getWriter();
                
        String str = "";
        //System.out.println(t + " " + timeStamp);
       // if (t < timeStamp) {
            File f = new File("c:/abcd/text.txt");
            if (!f.exists()) {
                writer.write("");
            }
            FileReader fr = new FileReader(f);
            int c = fr.read();
            while (c != -1) {
                str += (char) c;
                c = fr.read();
            }
            fr.close();
       // }
        writer.write(str);
        writer.close();

    }

    public void setDataToFile(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String str = req.getParameter("data");
        timeStamp = Calendar.getInstance().getTimeInMillis();
        File f = new File("c:/abcd/text.txt");
        if (!f.exists()) {
            f.createNewFile();
        }
        FileWriter rw = new FileWriter(f);
        rw.write(str);
        rw.close();
    }

    @Override
    public void process(HttpServletRequest request, HttpServletResponse response) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
