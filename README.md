# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["screenshot of Login Page"](https://github.com/wojeong/tinyapp/blob/main/docs/login-page.png?raw=true)
!["screenshot of registeration page"](https://github.com/wojeong/tinyapp/blob/main/docs/register-page.png?raw=true)
!["screenshot of urls page"](https://github.com/wojeong/tinyapp/blob/main/docs/urls-page.png?raw=true)
!["screenshot of new url creaged"](https://github.com/wojeong/tinyapp/blob/main/docs/new-url-created.png?raw=true)
!["screenshot of show page with edit"](https://github.com/wojeong/tinyapp/blob/main/docs/show-page.png?raw=true)
!["screenshot of updated url"](https://github.com/wojeong/tinyapp/blob/main/docs/updated-url.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `npm start` command.

## Known Issue

- I was able to fix everything, but "/u/:id" function.
- Originally stored shortURL perfectly redirects to longURL
- BUT newly created URL crashes the app. 
- It is exactly the same string but only Orgianlly(urlDatabase) stored URL can be redirected