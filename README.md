# JSChallengeFramework-KhanAcademy
We want to analyze student-generated JavaScript code (for our CS platform: https://www.khanacademy.org/cs) and determine if certain aspects of their code is written as expected. We want this so that we can provide advanced unit testing for a student's program - be able to provide them with informed feedback (that's better than what normal unit testing can provide, but likely not as good as what a human could provide).


Planned Implementation
===========
1. Init blank Rails project with just a homepage, make user enter a password before access.

2. Show text editor, along with dropdown to select three diff types of analysis

    a. Black list selector: keywords that are not allowed in user code
    
    b. White list selector: keywords that must be in user code
    
    c. Hierarchy that says what keywords we should expect embedded in others (descendant selectors)
    
      I. Implementation will involve fetching user input on the UI, sending this to the API along with JS code, then comparing the
    relations to the current AST recursively.
    

3.Query info set and make POST request to Rails API for all UI selections, including white and black list.

4.Rails controller will take the white list, black list, and hierarchy into account and give cumulative list of errors

5.The errors will be gathered as a response to the front end and displayed for the user to see

Reason for choosing Acorn over Esprima:
==========

Acorn allowed me to simply clone the repos and strip everything I didn't need. I became really excited after finding an Esprima gem and spent a while doing all parsing server side, but found out that the library was flawed and a bit neglected in terms of maintenance. I didn't want to overcomplicate Sprockets and my current package management implementation with module loaders like browserify and npm, since I wasn't using that many JS modules. In terms of file size, I was able to strip down the extra libraries I didn't need (i.e. walk and parse_dammit) so that Acorn became significantly smaller than Esprima. Although Esprima's website had a nice UI and usage cases, I didn't find the documentation as comprehensive or extensive as Acorn. I was also able to modify Acorn's src and get some sensible results, whereas Esprima's src was a bit hard to follow. Methods of Esprima can be tested side by side with Acorn's (acorn/test/compare/esprima) where we could then test performance.

Usage
=======
-select keywords in white list that have to be present in JS code.

-select keywords in black list that can not be present in JS code.

-Use the hierarchy constructor to force descendant relations between certain keywords.

*Please note:

currently the submit button does nothing, the API request is made when a change event is triggered in the text editor
levels in the hierarchy structure correspond to differing level of parent-descendant relations
There are slight nuances in keywords selected in white list/back list and the actualy keywords in JS code. For instance "for statement" in the current implementation refers to a for loop of type:

for(var i=0;i<10;i++){
}

an enhanced for loop following this format is considered different and would not be recognized by the white list, black list, or hierarchy constructor:
for(i in arr){

}

Live Heroku Link:
====
http://js-challenge.herokuapp.com/
