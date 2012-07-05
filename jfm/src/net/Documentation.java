/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package net;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author anoop
 */
public class Documentation extends Base {

    public void save(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String htmlFile = req.getParameter("file");
        String userprofile = (String) System.getenv().get("USERPROFILE");
        File f = new File(userprofile + "/SkyDrive/workspace/StructJS1/importmanager.git/trunk/web"+htmlFile);
        System.out.println(f.getAbsoluteFile());
        String data = req.getParameter("data");
        FileWriter fw;
        try {
            fw = new FileWriter(f);
            fw.write(data);
            fw.close();
            
        } catch (IOException ex) {
            Logger.getLogger(Documentation.class.getName()).log(Level.SEVERE, null, ex);
           resp.sendError(333);
        }

    }
    
    public void saveLocations(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String htmlFile = req.getParameter("name") + ".html";
        String userprofile = (String) System.getenv().get("USERPROFILE");
        File f = new File(userprofile + "/SkyDrive/workspace/StructJS1/importmanager.git/trunk/web/html/cities/"+htmlFile);
        if(!f.exists()){
            f.createNewFile();
        }
        System.out.println(f.getAbsoluteFile());
        String data = req.getParameter("data");
        FileWriter fw;
        try {
            fw = new FileWriter(f, true);
            fw.write(data);
            fw.close();
            
        } catch (IOException ex) {
            Logger.getLogger(Documentation.class.getName()).log(Level.SEVERE, null, ex);
           resp.sendError(333);
        }

    }
    @Override
    public void process(HttpServletRequest request, HttpServletResponse response) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
