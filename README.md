# JSChallengeFramework-KhanAcademy
We want to analyze student-generated JavaScript code (for our CS platform: https://www.khanacademy.org/cs) and determine if certain aspects of their code is written as expected. We want this so that we can provide advanced unit testing for a student's program - be able to provide them with informed feedback (that's better than what normal unit testing can provide, but likely not as good as what a human could provide).


Planned Implementation
===========
1. Init blank Rails project with just a homepage, make user enter a password before access

2. Show text editor, along with dropdown to select three diff types of analysis
    a. Black list selector
    b. White list selector
    c. Hierarchy that says what keywords we should expected embedded in others 
      I. Implementation will involve fetching user input on the UI, sending this to the API along with JS code, then comparing the relations to the currect AST. 

3.Query info set and make POST request to Rails API for all UI selections, including white and black list.

4.Rails controller will take the white list, black list, and hierarchy into account and give cumulative list of errors

5.The errors will be gathered as a response to the front end and displayed for the user to see

Dates of breaking the project apart:

Friday/13th:
Simply put up rails projects, front end, password verification, and text editor, then link to Heroku and deploy live. Research documentation and functionality of both Espirma and Acorn. Begin thinking about which parser should be used. Just from the initial glance, I'm thinking Acorn - better support for traversing the AST.

Saturday/14th:
Finished up the front end. Began building APIs for analyzing JS code entered in codemirror instance using Acorn. 



Live Heroku Link:
http://js-challenge.herokuapp.com/
