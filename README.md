# JSChallengeFramework-KhanAcademy
We want to analyze student-generated JavaScript code (for our CS platform: https://www.khanacademy.org/cs) and determine if certain aspects of their code is written as expected. We want this so that we can provide advanced unit testing for a student's program - be able to provide them with informed feedback (that's better than what normal unit testing can provide, but likely not as good as what a human could provide).


Planned Implementation
===========
1. Put up Rails Blank Project with just a homepage, make the accessor enter a password before progression
2. After password is entered, verify and set cookie
3. Show text editor, along with dropdown to select three diff types of analysis
    a. black list selector
    b. white list selector
    c. hierarchy that says what we should expect in what
      I. one possible implementation for this is to arrays that are built and matched
4.Query info set and make POST request to rails APIS
5.Rails controller will take the white list, black list, and hierarchy into account and give cumulative list of errors
6.The errors will be gathered as a response to the front end and displayed for the user to see

Dates of breaking the project apart:

Friday/13th (started around 5PM):
Simply put up rails projects, front end, password verification, and text editor, then link to Heroku and deploy live. Research documentation and functionality of both Espirma and Acorn. Begin thinking about which parser should be used. Just from the initial glance, I'm thinking Acorn - better support for traversing the AST.




Live Heroku Link:
Coming soon!
