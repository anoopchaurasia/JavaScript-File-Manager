/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package tmpl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import net.Base;

/**
 *
 * @author anoop
 */
public class Template extends Base{

    public static void getTemplate(HttpServletRequest req, HttpServletResponse resp) throws FileNotFoundException, IOException {

        String userprofile = (String) System.getenv().get("USERPROFILE");
        File f = new File(userprofile + "/SkyDrive/workspace/StructJS1/importmanager.git/trunk/web/html/" + req.getParameter("data") + ".html");
        FileReader fr = new FileReader(f);
        String str = "";
        int c = fr.read();
        while (c != -1) {
            str += (char) c;
            c = fr.read();
        }
        fr.close();
        resp.getWriter().write(str);
        resp.getWriter().close();
    }
    @Override
    public void process(HttpServletRequest request, HttpServletResponse response) {
        throw new UnsupportedOperationException("Not supported yet.");
    }
}
