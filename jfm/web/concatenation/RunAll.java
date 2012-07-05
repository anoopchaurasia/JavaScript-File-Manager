
import java.io.*;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

class AjaxTools {

    private static String concatenatedString = "";
    private static LinkedHashSet ConcatenatedFiles = new LinkedHashSet();
    private String ext;
    private String javascriptSourceFolder;
    private String backSlash = "";

    public AjaxTools(String dir) {

        this.javascriptSourceFolder = dir;
    }

    private String[] getPathFromImports(String path) {

        path = path.replaceAll("\\s+", "");
        int startIndex = path.indexOf('(');
        int endIndex = path.indexOf(')');       
        path = path.substring(startIndex + 2, endIndex - 1);
        if (path.startsWith("http")) {
            return (new String[]{path});
        }

        path = path.replace(".", "" + File.separatorChar).replace("\'", "").replace("\"", "").trim();
        String[] paths = path.split(",");
        for (int i = 0; i < paths.length; i++) {

            paths[i] = javascriptSourceFolder + paths[i] + "." + ext;
        }
        return paths;
    }

    private void visitAllFiles(String path, boolean traverse)
            throws FileNotFoundException, IOException {
        if (!ConcatenatedFiles.contains(path)) {
            ConcatenatedFiles.add(path);
            File file = new File(path);
            processFile(file, traverse);
        }
    }

    private void addFiles(String pathsstr, int from, int to) throws FileNotFoundException, IOException {

        String[] pth = getPathFromImports(pathsstr);
        for (int k = from; k < pth.length && k < to; k++) {

            if (!pth[k].startsWith("http")) {
                visitAllFiles(pth[k], true);
            }
        }
    }

    private void processFile(File f, boolean traverse) throws FileNotFoundException,
            IOException {
        FileInputStream fis = null;
        BufferedInputStream bis = null;
        DataInputStream dis = null;
        boolean isCompleted = false, isLineAdded;
        try {
            fis = new FileInputStream(f);

            // Here BufferedInputStream is added for fast reading.
            bis = new BufferedInputStream(fis);
            dis = new DataInputStream(bis);

            // dis.available() returns 0 if the file does not have more lines.
            String stringHolder = "";
            while (dis.available() != 0) {
                // this statement reads the line from the file and print it to
                // the console.
                String line = dis.readLine();

                while (line != null) {
                    isLineAdded = false;
                    if (!isCompleted && traverse) {
                        if (line.indexOf("function") == -1) {
                            if (line.indexOf("fm.Package") != -1) {
                                stringHolder = line + backSlash + "\n";
                                isLineAdded = true;
                            }
                            if (line.indexOf("fm.Import") != -1) {
                                stringHolder += line + backSlash + "\n";
                                addFiles(line, 0, 1);
                                isLineAdded = true;
                            }
                            if (line.indexOf("fm.Base") != -1) {
                                stringHolder += line + backSlash + "\n";
                                addFiles(line, 0, 1);
                                isLineAdded = true;
                            }
                            if (line.indexOf("fm.Include") != -1) {
                                stringHolder += line + backSlash + "\n";
                                addFiles(line, 0, 1);
                                isLineAdded = true;
                            }
                            if (line.indexOf("fm.Implements") != -1) {
                                stringHolder += line + backSlash + "\n";
                                addFiles(line, 0, 999);
                                isLineAdded = true;
                            }
                            if ((line.indexOf("fm.Class") != -1 || line.indexOf("fm.Interface") != -1 || line.indexOf("fm.AbstractClass") != -1 )) {
                                stringHolder += line + backSlash + "\n";
                                addFiles(line, 1, 2);
                                isCompleted = true;
                                isLineAdded = true;
                            }
                        }
                        if (!isLineAdded) {
                            concatenatedString += line + backSlash + "\n";
                        }

                    } else {
                        stringHolder += line + backSlash + "\n";
                    }
                    line = dis.readLine();
                }
            }
            concatenatedString += stringHolder;

            // dispose all the resources after using them.
            fis.close();
            bis.close();
            dis.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void prepareConcatenated(String filePath1,
            String storagePath, Boolean append) {

        try {
            visitAllFiles(filePath1, append);
            FileWriter fstream = new FileWriter(storagePath, append);
            BufferedWriter out = new BufferedWriter(fstream);
            if(append){
                concatenatedString += "fm.isConcatinated = false;\n";
            }
            out.write(concatenatedString);
            out.close();
        } catch (FileNotFoundException ex) {
            Logger.getLogger(AjaxTools.class.getName()).log(Level.SEVERE,
                    null, ex);
        } catch (IOException ex) {
            Logger.getLogger(AjaxTools.class.getName()).log(Level.SEVERE,
                    null, ex);
        }
    }

    private void deleteFile(String dir) {
        try {
            File file = new File(dir);
            if (!file.delete()) {
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void concatenateHTMLFiles(String sourceFolder, String destinationFile) throws IOException {
        deleteFile(destinationFile);
        backSlash = "\\";
        File dir = new File(sourceFolder);
        String[] list = dir.list();
        concatenatedString = "var master='\\\n";
        ConcatenatedFiles.clear();
        ext = "htm";
        boolean append = false;
        for (int i = 0; i < list.length; i++) {
            if (list[i].endsWith(ext)) {
                prepareConcatenated(sourceFolder + list[i],
                        destinationFile, append);
                append = true;
                concatenatedString = "";
            }
        }
        concatenatedString = "';";
        FileWriter fstream = new FileWriter(destinationFile, append);
        BufferedWriter out = new BufferedWriter(fstream);
        out.write(concatenatedString);
        out.close();
    }

    public String convertStreamToString(InputStream is) throws IOException {
        /*
         * To convert the InputStream to String we use the Reader.read(char[]
         * buffer) method. We iterate until the Reader return -1 which means
         * there's no more data to read. We use the StringWriter class to
         * produce the string.
         */
        if (is != null) {
            Writer writer = new StringWriter();

            char[] buffer = new char[1024];
            try {
                Reader reader = new BufferedReader(new InputStreamReader(is,
                        "UTF-8"));
                int n;
                while ((n = reader.read(buffer)) != -1) {
                    writer.write(buffer, 0, n);
                }
            } finally {
                is.close();
            }
            return writer.toString();
        } else {
            return "";
        }
    }

    public void concatenateJSFiles(List<String> sFiles, String dFile) throws IOException {

        this.ext = "js";
        backSlash = "";
        deleteFile(dFile);
        //String[] commands;
        //Runtime rt = Runtime.getRuntime();
        concatenatedString = "";
        ConcatenatedFiles.clear();
        boolean append = false;
        for (int i = 0; i < sFiles.size(); i++) {
            prepareConcatenated(sFiles.get(i),
                    dFile, append);
            append = true;
            concatenatedString = "fm.isConcatinated = true;\n";
        }
//        commands = new String[]{
//            "java",
//            "-jar",
//            this.baseDir  + "compiler.jar",
//            "--js",
//            dFile,
//            "--js_output_file",
//            dFile + "min.js"
//        };
//
//        Process p= rt.exec(commands);
//		System.out.println("creating " + dFile + " and " + dFile + "min.js");
//		InputStream in= p.getErrorStream();
//		String myString = convertStreamToString( in );
//        System.out.println(myString);
    }

    public void concatenateCSSFiles(String sourceFolder, String destinationFolder) {

        deleteFile(destinationFolder);
    }
}

public class RunAll {

    public static void main(String[] args) throws IOException {

        String baseDir = "", outputFile = "";
        List<String> inputFiles = new ArrayList<String>();
        for (int i = 0; i < args.length; i++) {
            if (args[i].equals("-b")) {
                baseDir = args[ ++i];
                System.out.println("Base dir " + args[i]);
            } else if (args[i].equals("-o")) {
                outputFile = args[++i];
                System.out.println("Output File " +args[i]);
            } else if (!args[i].equals("-s")) {
                inputFiles.add(args[i]);
                System.out.println("Sourse File " + args[i]);
            }
        }
        AjaxTools ajt = new AjaxTools(baseDir);
        ajt.concatenateJSFiles(inputFiles, outputFile);

    }
}
