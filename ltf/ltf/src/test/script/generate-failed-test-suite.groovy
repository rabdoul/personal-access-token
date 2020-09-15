import groovy.xml.MarkupBuilder

import java.nio.file.Files
import java.nio.file.Paths

def destination = "src/test/resources/testng-suite-failed.xml"
def failedTests = System.getProperty("failedTests").split(",")
def writer = new StringWriter()
def xml = new MarkupBuilder(writer)

xml.suite('allow-return-values': "true", name: "LocalSuite", 'thread-count': "1") {
    parameter(name: 'maven-mode', value: "true")
    test(name: 'failed-tests') {
        parameter(name: 'browser-name', value: "chrome")
        classes {
            failedTests.each { 'class'(name: 'sanitycheck.' + it) }
        }
    }
}

Files.write(Paths.get(destination), writer.toString().getBytes())