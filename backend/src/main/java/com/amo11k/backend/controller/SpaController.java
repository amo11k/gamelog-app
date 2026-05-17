package com.amo11k.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaController {

    @RequestMapping(value = "/{path:[^\\.]*}", produces = "text/html")
    public String forwardHtml() {
        return "forward:/index.html";
    }

    @RequestMapping(value = "/{x:[^\\.]*}/{y:[^\\.]*}", produces = "text/html")
    public String forwardNestedHtml() {
        return "forward:/index.html";
    }

    @RequestMapping(value = "/{x:[^\\.]*}/{y:[^\\.]*}/{z:[^\\.]*}", produces = "text/html")
    public String forwardDeepHtml() {
        return "forward:/index.html";
    }
}
